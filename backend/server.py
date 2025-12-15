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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    location: str
    area: str
    status: str = "planning"
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    images: List[str] = []
    lead_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    title: str
    description: str
    location: str
    area: str
    status: str = "planning"
    lead_id: Optional[str] = None

class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: str
    project_type: str
    area: float
    estimated_cost: float
    details: str
    status: str = "draft"
    valid_until: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteCreate(BaseModel):
    lead_id: str
    project_type: str
    area: float
    estimated_cost: float
    details: str
    valid_days: int = 30

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
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Auth routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        name=user_data.name
    )
    
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

@api_router.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, update_data: LeadUpdate, user = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.leads.update_one({"id": lead_id}, {"$set": update_dict})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Lead updated"}

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
async def get_projects():
    projects = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
        if project.get('start_date') and isinstance(project['start_date'], str):
            project['start_date'] = datetime.fromisoformat(project['start_date'])
        if project.get('completion_date') and isinstance(project['completion_date'], str):
            project['completion_date'] = datetime.fromisoformat(project['completion_date'])
    return projects

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

# Analytics route
@api_router.get("/analytics", response_model=Analytics)
async def get_analytics(user = Depends(get_current_user)):
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    active_projects = await db.projects.count_documents({"status": {"$in": ["planning", "in_progress"]}})
    quotes_sent = await db.quotes.count_documents({})
    
    conversion_rate = (active_projects / total_leads * 100) if total_leads > 0 else 0
    
    return Analytics(
        total_leads=total_leads,
        new_leads=new_leads,
        active_projects=active_projects,
        quotes_sent=quotes_sent,
        conversion_rate=round(conversion_rate, 2)
    )

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