from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'kozsag-secret-key-2025')
JWT_ALGORITHM = 'HS256'

# Models
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: str
    status: str = "new"
    source: str = "website"
    score: int = 0
    budget: Optional[float] = None
    timeline: Optional[str] = None
    notes: List[Dict[str, Any]] = []
    reminders: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    budget: Optional[float] = None
    timeline: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    score: Optional[int] = None
    budget: Optional[float] = None
    timeline: Optional[str] = None

class LeadNote(BaseModel):
    lead_id: str
    note: str

class LeadReminder(BaseModel):
    lead_id: str
    reminder_date: datetime
    reminder_text: str

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    location: str
    area: str
    status: str = "planning"
    budget: Optional[float] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    milestones: List[Dict[str, Any]] = []
    images: List[str] = []
    documents: List[str] = []
    lead_id: Optional[str] = None
    progress: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    title: str
    description: str
    location: str
    area: str
    status: str = "planning"
    budget: Optional[float] = None
    start_date: Optional[datetime] = None
    lead_id: Optional[str] = None

class ProjectMilestone(BaseModel):
    project_id: str
    milestone_name: str
    target_date: datetime
    completed: bool = False

class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: str
    project_type: str
    area: float
    estimated_cost: float
    details: str
    items: List[Dict[str, Any]] = []
    status: str = "draft"
    valid_until: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteCreate(BaseModel):
    lead_id: str
    project_type: str
    area: float
    estimated_cost: float
    details: str
    items: List[Dict[str, Any]] = []
    valid_days: int = 30

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = "medium"
    status: str = "pending"
    related_lead_id: Optional[str] = None
    related_project_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    title: str
    description: str
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = "medium"
    related_lead_id: Optional[str] = None
    related_project_id: Optional[str] = None

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    appointment_date: datetime
    duration_minutes: int = 60
    location: Optional[str] = None
    lead_id: Optional[str] = None
    status: str = "scheduled"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    title: str
    description: str
    appointment_date: datetime
    duration_minutes: int = 60
    location: Optional[str] = None
    lead_id: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class Analytics(BaseModel):
    total_leads: int
    new_leads: int
    active_projects: int
    quotes_sent: int
    conversion_rate: float
    pending_tasks: int
    upcoming_appointments: int

# Auth helpers
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")

# Auth routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=user_data.email, name=user_data.name)
    doc = user.model_dump()
    doc['password'] = hash_password(user_data.password)
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    token = create_token(user.id, user.email)
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc or not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user_doc['id'], user_doc['email'])
    user_doc.pop('password')
    return {"token": token, "user": user_doc}

# Lead routes
@api_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    lead = Lead(**lead_data.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.leads.insert_one(doc)
    return lead

@api_router.get("/leads", response_model=List[Lead])
async def get_leads(user = Depends(get_current_user)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
        if isinstance(lead.get('updated_at'), str):
            lead['updated_at'] = datetime.fromisoformat(lead['updated_at'])
    return leads

@api_router.get("/leads/{lead_id}")
async def get_lead(lead_id: str, user = Depends(get_current_user)):
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if isinstance(lead.get('created_at'), str):
        lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    if isinstance(lead.get('updated_at'), str):
        lead['updated_at'] = datetime.fromisoformat(lead['updated_at'])
    
    return lead

@api_router.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, update_data: LeadUpdate, user = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.leads.update_one({"id": lead_id}, {"$set": update_dict})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Lead updated"}

@api_router.post("/leads/{lead_id}/notes")
async def add_lead_note(lead_id: str, note_data: LeadNote, user = Depends(get_current_user)):
    note = {
        "id": str(uuid.uuid4()),
        "note": note_data.note,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": user['email']
    }
    
    result = await db.leads.update_one(
        {"id": lead_id},
        {"$push": {"notes": note}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Note added", "note": note}

@api_router.post("/leads/{lead_id}/reminders")
async def add_lead_reminder(lead_id: str, reminder_data: LeadReminder, user = Depends(get_current_user)):
    reminder = {
        "id": str(uuid.uuid4()),
        "reminder_text": reminder_data.reminder_text,
        "reminder_date": reminder_data.reminder_date.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.leads.update_one(
        {"id": lead_id},
        {"$push": {"reminders": reminder}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Reminder added", "reminder": reminder}

@api_router.post("/leads/{lead_id}/convert-to-project")
async def convert_lead_to_project(lead_id: str, user = Depends(get_current_user)):
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    project = Project(
        title=f"Proje - {lead['name']}",
        description=lead.get('message', ''),
        location="Belirtilecek",
        area="Belirtilecek",
        status="planning",
        lead_id=lead_id
    )
    
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('start_date'):
        doc['start_date'] = doc['start_date'].isoformat()
    if doc.get('completion_date'):
        doc['completion_date'] = doc['completion_date'].isoformat()
    
    await db.projects.insert_one(doc)
    await db.leads.update_one({"id": lead_id}, {"$set": {"status": "converted"}})
    
    return {"message": "Lead converted to project", "project": project}

# Project routes
@api_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, user = Depends(get_current_user)):
    project = Project(**project_data.model_dump())
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('start_date'):
        doc['start_date'] = doc['start_date'].isoformat()
    if doc.get('completion_date'):
        doc['completion_date'] = doc['completion_date'].isoformat()
    
    await db.projects.insert_one(doc)
    return project

@api_router.get("/projects", response_model=List[Project])
async def get_projects(user = Depends(get_current_user)):
    projects = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
        if project.get('start_date') and isinstance(project['start_date'], str):
            project['start_date'] = datetime.fromisoformat(project['start_date'])
        if project.get('completion_date') and isinstance(project['completion_date'], str):
            project['completion_date'] = datetime.fromisoformat(project['completion_date'])
    return projects

@api_router.get("/projects/{project_id}")
async def get_project(project_id: str, user = Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if isinstance(project.get('created_at'), str):
        project['created_at'] = datetime.fromisoformat(project['created_at'])
    if project.get('start_date') and isinstance(project['start_date'], str):
        project['start_date'] = datetime.fromisoformat(project['start_date'])
    if project.get('completion_date') and isinstance(project['completion_date'], str):
        project['completion_date'] = datetime.fromisoformat(project['completion_date'])
    
    return project

@api_router.post("/projects/{project_id}/milestones")
async def add_project_milestone(project_id: str, milestone_data: ProjectMilestone, user = Depends(get_current_user)):
    milestone = {
        "id": str(uuid.uuid4()),
        "milestone_name": milestone_data.milestone_name,
        "target_date": milestone_data.target_date.isoformat(),
        "completed": milestone_data.completed,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.projects.update_one(
        {"id": project_id},
        {"$push": {"milestones": milestone}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Milestone added", "milestone": milestone}

# Quote routes
@api_router.post("/quotes", response_model=Quote)
async def create_quote(quote_data: QuoteCreate, user = Depends(get_current_user)):
    valid_until = datetime.now(timezone.utc) + timedelta(days=quote_data.valid_days)
    quote = Quote(
        **{k: v for k, v in quote_data.model_dump().items() if k != 'valid_days'},
        valid_until=valid_until
    )
    
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['valid_until'] = doc['valid_until'].isoformat()
    
    await db.quotes.insert_one(doc)
    return quote

@api_router.get("/quotes", response_model=List[Quote])
async def get_quotes(user = Depends(get_current_user)):
    quotes = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for quote in quotes:
        if isinstance(quote.get('created_at'), str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
        if isinstance(quote.get('valid_until'), str):
            quote['valid_until'] = datetime.fromisoformat(quote['valid_until'])
    return quotes

# Task routes
@api_router.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate, user = Depends(get_current_user)):
    task = Task(**task_data.model_dump())
    doc = task.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('due_date'):
        doc['due_date'] = doc['due_date'].isoformat()
    
    await db.tasks.insert_one(doc)
    return task

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(user = Depends(get_current_user)):
    tasks = await db.tasks.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for task in tasks:
        if isinstance(task.get('created_at'), str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
        if task.get('due_date') and isinstance(task['due_date'], str):
            task['due_date'] = datetime.fromisoformat(task['due_date'])
    return tasks

@api_router.patch("/tasks/{task_id}")
async def update_task(task_id: str, status: str, user = Depends(get_current_user)):
    result = await db.tasks.update_one(
        {"id": task_id},
        {"$set": {"status": status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task updated"}

# Appointment routes
@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment_data: AppointmentCreate, user = Depends(get_current_user)):
    appointment = Appointment(**appointment_data.model_dump())
    doc = appointment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['appointment_date'] = doc['appointment_date'].isoformat()
    
    await db.appointments.insert_one(doc)
    return appointment

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(user = Depends(get_current_user)):
    appointments = await db.appointments.find({}, {"_id": 0}).sort("appointment_date", 1).to_list(1000)
    for appointment in appointments:
        if isinstance(appointment.get('created_at'), str):
            appointment['created_at'] = datetime.fromisoformat(appointment['created_at'])
        if isinstance(appointment.get('appointment_date'), str):
            appointment['appointment_date'] = datetime.fromisoformat(appointment['appointment_date'])
    return appointments

# Analytics route
@api_router.get("/analytics", response_model=Analytics)
async def get_analytics(user = Depends(get_current_user)):
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    active_projects = await db.projects.count_documents({"status": {"$in": ["planning", "in_progress"]}})
    quotes_sent = await db.quotes.count_documents({})
    pending_tasks = await db.tasks.count_documents({"status": "pending"})
    
    now = datetime.now(timezone.utc).isoformat()
    upcoming_appointments = await db.appointments.count_documents({
        "appointment_date": {"$gte": now},
        "status": "scheduled"
    })
    
    conversion_rate = (active_projects / total_leads * 100) if total_leads > 0 else 0
    
    return Analytics(
        total_leads=total_leads,
        new_leads=new_leads,
        active_projects=active_projects,
        quotes_sent=quotes_sent,
        conversion_rate=round(conversion_rate, 2),
        pending_tasks=pending_tasks,
        upcoming_appointments=upcoming_appointments
    )

# Sales funnel data
@api_router.get("/analytics/funnel")
async def get_sales_funnel(user = Depends(get_current_user)):
    total_leads = await db.leads.count_documents({})
    qualified_leads = await db.leads.count_documents({"status": "qualified"})
    quotes_sent = await db.quotes.count_documents({})
    projects_won = await db.projects.count_documents({"status": {"$in": ["in_progress", "completed"]}})
    
    return {
        "total_leads": total_leads,
        "qualified_leads": qualified_leads,
        "quotes_sent": quotes_sent,
        "projects_won": projects_won
    }

# Monthly revenue data
@api_router.get("/analytics/revenue")
async def get_revenue_data(user = Depends(get_current_user)):
    projects = await db.projects.find({}, {"_id": 0, "budget": 1, "status": 1, "created_at": 1}).to_list(1000)
    
    monthly_revenue = {}
    for project in projects:
        if project.get('budget') and project.get('status') in ['in_progress', 'completed']:
            created_at = project.get('created_at')
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at)
            month_key = created_at.strftime('%Y-%m')
            monthly_revenue[month_key] = monthly_revenue.get(month_key, 0) + project['budget']
    
    return {"monthly_revenue": monthly_revenue}

# Chat route
@api_router.post("/chat", response_model=ChatResponse)
async def chat(chat_data: ChatMessage):
    session_id = chat_data.session_id or str(uuid.uuid4())
    
    system_message = """Sen Kozsağ Group İnşaat'ın müşteri hizmetleri asistanısın. 
    Kozsağ Group, taş ev inşaatı konusunda uzmanlaşmış prestijli bir inşaat firmasıdır.
    
    Hizmetlerimiz:
    - Müstakil taş ev inşaatı
    - Lüks villa projeleri
    - Çok katlı konut binaları
    - Doğal taş kaplama ve dış cephe
    - Peyzaj ve dış mekan düzenlemesi
    
    Müşterilere nazik ve profesyonel bir şekilde yardımcı ol. 
    Proje detayları, fiyat teklifleri ve randevu talepleri için iletişim formunu doldurmalarını öner.
    Türkçe olarak yanıt ver."""
    
    try:
        chat_client = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5.1")
        
        user_message = UserMessage(text=chat_data.message)
        response = await chat_client.send_message(user_message)
        
        await db.chat_history.insert_one({
            "session_id": session_id,
            "user_message": chat_data.message,
            "assistant_response": response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        return ChatResponse(response=response, session_id=session_id)
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
