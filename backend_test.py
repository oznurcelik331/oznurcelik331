#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Kozsağ Group İnşaat
Tests all FastAPI endpoints including authentication, leads, projects, quotes, analytics, and chat
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class KozsagAPITester:
    def __init__(self, base_url="https://insaatech.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session_id = None
        
    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")
        print()

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, headers: Optional[Dict] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        
        # Default headers
        default_headers = {'Content-Type': 'application/json'}
        if self.token:
            default_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            default_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            details = f"Status: {response.status_code} (expected {expected_status})"
            if not success:
                details += f", Response: {response_data}"
                
            self.log_test(name, success, details, response_data if success else None)
            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_auth_register(self) -> bool:
        """Test user registration"""
        test_user_data = {
            "email": "admin@kozsag.com",
            "password": "admin123",
            "name": "Admin User"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_auth_login(self) -> bool:
        """Test user login"""
        login_data = {
            "email": "admin@kozsag.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_create_lead(self) -> Optional[str]:
        """Test lead creation"""
        lead_data = {
            "name": "Test Müşteri",
            "email": "test@example.com",
            "phone": "+90 532 123 45 67",
            "message": "Taş villa inşaatı için bilgi almak istiyorum."
        }
        
        success, response = self.run_test(
            "Create Lead",
            "POST",
            "leads",
            200,
            data=lead_data
        )
        
        return response.get('id') if success else None

    def test_get_leads(self) -> bool:
        """Test getting leads (requires auth)"""
        success, response = self.run_test(
            "Get Leads",
            "GET",
            "leads",
            200
        )
        return success

    def test_update_lead(self, lead_id: str) -> bool:
        """Test lead status update"""
        if not lead_id:
            self.log_test("Update Lead", False, "No lead ID provided")
            return False
            
        update_data = {
            "status": "contacted",
            "notes": "Müşteri ile iletişime geçildi"
        }
        
        success, response = self.run_test(
            "Update Lead Status",
            "PATCH",
            f"leads/{lead_id}",
            200,
            data=update_data
        )
        return success

    def test_create_project(self) -> Optional[str]:
        """Test project creation (requires auth)"""
        project_data = {
            "title": "Test Taş Villa Projesi",
            "description": "Modern taş villa inşaatı",
            "location": "İzmir",
            "area": "350 m²",
            "status": "planning"
        }
        
        success, response = self.run_test(
            "Create Project",
            "POST",
            "projects",
            200,
            data=project_data
        )
        
        return response.get('id') if success else None

    def test_get_projects(self) -> bool:
        """Test getting projects (public endpoint)"""
        success, response = self.run_test(
            "Get Projects",
            "GET",
            "projects",
            200
        )
        return success

    def test_create_quote(self, lead_id: str) -> Optional[str]:
        """Test quote creation (requires auth)"""
        if not lead_id:
            self.log_test("Create Quote", False, "No lead ID provided")
            return False
            
        quote_data = {
            "lead_id": lead_id,
            "project_type": "Taş Villa",
            "area": 350.0,
            "estimated_cost": 2500000.0,
            "details": "350 m² taş villa inşaatı, peyzaj dahil",
            "valid_days": 30
        }
        
        success, response = self.run_test(
            "Create Quote",
            "POST",
            "quotes",
            200,
            data=quote_data
        )
        
        return response.get('id') if success else None

    def test_get_quotes(self) -> bool:
        """Test getting quotes (requires auth)"""
        success, response = self.run_test(
            "Get Quotes",
            "GET",
            "quotes",
            200
        )
        return success

    def test_get_analytics(self) -> bool:
        """Test analytics endpoint (requires auth)"""
        success, response = self.run_test(
            "Get Analytics",
            "GET",
            "analytics",
            200
        )
        
        if success:
            # Verify analytics structure
            required_fields = ['total_leads', 'new_leads', 'active_projects', 'quotes_sent', 'conversion_rate']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Analytics Structure", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Analytics Structure", True, "All required fields present")
        
        return success

    def test_chat_functionality(self) -> bool:
        """Test AI chatbot functionality"""
        chat_data = {
            "message": "Merhaba, taş ev inşaatı hakkında bilgi alabilir miyim?",
            "session_id": self.session_id
        }
        
        success, response = self.run_test(
            "AI Chat - Turkish Query",
            "POST",
            "chat",
            200,
            data=chat_data
        )
        
        if success:
            if 'session_id' in response:
                self.session_id = response['session_id']
            
            # Verify response structure
            if 'response' in response and response['response']:
                self.log_test("Chat Response Content", True, f"Response length: {len(response['response'])} chars")
                
                # Test follow-up message
                followup_data = {
                    "message": "Fiyat bilgisi verebilir misiniz?",
                    "session_id": self.session_id
                }
                
                success2, response2 = self.run_test(
                    "AI Chat - Follow-up Query",
                    "POST",
                    "chat",
                    200,
                    data=followup_data
                )
                return success2
            else:
                self.log_test("Chat Response Content", False, "Empty or missing response")
                return False
        
        return success

    def test_unauthorized_access(self) -> bool:
        """Test endpoints that require authentication without token"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        # Test protected endpoints
        protected_tests = [
            ("Get Leads (Unauthorized)", "GET", "leads", 401),
            ("Create Project (Unauthorized)", "POST", "projects", 401),
            ("Get Analytics (Unauthorized)", "GET", "analytics", 401),
        ]
        
        all_passed = True
        for test_name, method, endpoint, expected_status in protected_tests:
            success, _ = self.run_test(test_name, method, endpoint, expected_status)
            if not success:
                all_passed = False
        
        # Restore token
        self.token = original_token
        return all_passed

    def run_comprehensive_test(self) -> Dict[str, Any]:
        """Run all tests in sequence"""
        print("🚀 Starting Kozsağ Group İnşaat Backend API Tests")
        print("=" * 60)
        
        # Test authentication
        print("📋 Testing Authentication...")
        auth_success = self.test_auth_register()
        if not auth_success:
            # Try login if registration fails (user might already exist)
            auth_success = self.test_auth_login()
        
        if not auth_success:
            print("❌ Authentication failed - stopping tests")
            return self.get_test_summary()
        
        # Test unauthorized access
        print("🔒 Testing Authorization...")
        self.test_unauthorized_access()
        
        # Test lead management
        print("👥 Testing Lead Management...")
        lead_id = self.test_create_lead()
        self.test_get_leads()
        if lead_id:
            self.test_update_lead(lead_id)
        
        # Test project management
        print("🏗️ Testing Project Management...")
        project_id = self.test_create_project()
        self.test_get_projects()
        
        # Test quote management
        print("💰 Testing Quote Management...")
        if lead_id:
            quote_id = self.test_create_quote(lead_id)
        self.test_get_quotes()
        
        # Test analytics
        print("📊 Testing Analytics...")
        self.test_get_analytics()
        
        # Test AI chatbot
        print("🤖 Testing AI Chatbot...")
        self.test_chat_functionality()
        
        return self.get_test_summary()

    def get_test_summary(self) -> Dict[str, Any]:
        """Get comprehensive test summary"""
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        failed_tests = [test for test in self.test_results if not test['success']]
        
        summary = {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": len(failed_tests),
            "success_rate": round(success_rate, 2),
            "failed_test_details": failed_tests,
            "all_test_results": self.test_results
        }
        
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(failed_tests)}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"  - {test['test_name']}: {test['details']}")
        
        return summary

def main():
    """Main test execution"""
    tester = KozsagAPITester()
    
    try:
        summary = tester.run_comprehensive_test()
        
        # Save detailed results
        with open('/app/backend_test_results.json', 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
        
        # Return appropriate exit code
        return 0 if summary['success_rate'] >= 80 else 1
        
    except Exception as e:
        print(f"❌ Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())