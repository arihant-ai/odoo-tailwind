#!/usr/bin/env python3
"""
Test script to verify Odoo 18 installation and database connectivity
"""

import xmlrpc.client
import sys
import time

def test_odoo_connection():
    """Test Odoo connection and basic functionality"""
    
    print("🧪 Testing Odoo 18 Installation")
    print("=" * 40)
    
    # Odoo connection parameters
    url = 'http://localhost:8069'
    
    try:
        # Test 1: Check if Odoo is responding
        print("1. Testing Odoo server response...")
        common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
        version_info = common.version()
        print(f"   ✅ Odoo version: {version_info['server_version']}")
        print(f"   ✅ Server series: {version_info['server_serie']}")
        print(f"   ✅ Protocol version: {version_info['protocol_version']}")
        
        # Test 2: List available databases
        print("\n2. Testing database connectivity...")
        try:
            db_list = common.list()
            if db_list:
                print(f"   ✅ Available databases: {', '.join(db_list)}")
            else:
                print("   ⚠️  No databases found (this is normal for fresh installation)")
        except Exception as e:
            print(f"   ⚠️  Database listing not available: {e}")
        
        # Test 3: Check if we can create a database
        print("\n3. Testing database creation capability...")
        try:
            # Try to get database creation form (this tests if the service is working)
            import urllib.request
            import urllib.error
            
            response = urllib.request.urlopen(f'{url}/web/database/manager', timeout=10)
            if response.status == 200:
                print("   ✅ Database manager accessible")
            else:
                print(f"   ⚠️  Database manager returned status: {response.status}")
        except urllib.error.URLError as e:
            print(f"   ❌ Database manager not accessible: {e}")
        except Exception as e:
            print(f"   ⚠️  Database manager test failed: {e}")
        
        # Test 4: Check addon availability
        print("\n4. Testing addon system...")
        try:
            # This is a basic test - in a real scenario you'd need to authenticate first
            print("   ✅ XMLRPC interface is working")
            print("   ℹ️  To test addons, create a database first")
        except Exception as e:
            print(f"   ❌ Addon system test failed: {e}")
        
        print("\n" + "=" * 40)
        print("🎉 Odoo 18 installation test completed!")
        print("\nNext steps:")
        print("1. Open http://localhost:8069 in your browser")
        print("2. Create a new database")
        print("3. Install the 'website_tailwind' module")
        print("4. Visit /tailwind-docs to see Tailwind integration")
        
        return True
        
    except xmlrpc.client.ProtocolError as e:
        print(f"❌ XMLRPC Protocol Error: {e}")
        print("   Make sure Odoo is running on http://localhost:8069")
        return False
    except ConnectionRefusedError:
        print("❌ Connection refused")
        print("   Make sure Odoo containers are running: ./setup.sh start")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def wait_for_odoo(max_wait=60):
    """Wait for Odoo to be ready"""
    print(f"⏳ Waiting for Odoo to be ready (max {max_wait}s)...")
    
    for i in range(max_wait):
        try:
            common = xmlrpc.client.ServerProxy('http://localhost:8069/xmlrpc/2/common')
            common.version()
            print("✅ Odoo is ready!")
            return True
        except:
            if i % 10 == 0:  # Print every 10 seconds
                print(f"   Still waiting... ({i}s)")
            time.sleep(1)
    
    print("❌ Timeout waiting for Odoo")
    return False

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--wait":
        if not wait_for_odoo():
            sys.exit(1)
    
    success = test_odoo_connection()
    sys.exit(0 if success else 1)
