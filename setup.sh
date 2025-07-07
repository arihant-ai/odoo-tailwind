#!/bin/bash

# Odoo 18 + Tailwind CSS Setup Script
# This script helps with the installation and management of Odoo 18 with Tailwind CSS integration

set -e

echo "🚀 Odoo 18 + Tailwind CSS Setup Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Docker is running
check_docker() {
    print_header "Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running ✓"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_header "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    print_status "Docker Compose is available ✓"
}

# Install Node.js dependencies
install_dependencies() {
    print_header "Installing Node.js dependencies..."
    if [ ! -d "node_modules" ]; then
        npm install
        print_status "Node.js dependencies installed ✓"
    else
        print_status "Node.js dependencies already installed ✓"
    fi
}

# Build Tailwind CSS
build_tailwind() {
    print_header "Building Tailwind CSS..."
    npm run build-prod
    print_status "Tailwind CSS built successfully ✓"
}

# Start Docker containers
start_containers() {
    print_header "Starting Docker containers..."
    docker-compose up -d
    print_status "Docker containers started ✓"
}

# Stop Docker containers
stop_containers() {
    print_header "Stopping Docker containers..."
    docker-compose down
    print_status "Docker containers stopped ✓"
}

# Check container status
check_status() {
    print_header "Container Status:"
    docker-compose ps
}

# View logs
view_logs() {
    local service=${1:-odoo}
    print_header "Viewing logs for $service..."
    docker-compose logs -f $service
}

# Install Tailwind addon in Odoo
install_addon() {
    print_header "Installing website_tailwind addon..."
    print_status "Please follow these steps in your browser:"
    echo "1. Open http://localhost:8069"
    echo "2. Create a new database or use an existing one"
    echo "3. Go to Apps menu"
    echo "4. Search for 'website_tailwind'"
    echo "5. Install the 'Website Tailwind CSS Integration' module"
    echo "6. Visit /tailwind-docs to see the integration in action"
}

# Test the installation
test_installation() {
    print_header "Testing installation..."
    
    # Check if Odoo is responding
    if curl -s http://localhost:8069 > /dev/null; then
        print_status "Odoo is accessible at http://localhost:8069 ✓"
    else
        print_error "Odoo is not accessible. Check the logs with: $0 logs"
        return 1
    fi
    
    # Check if Tailwind CSS file exists
    if [ -f "addons/website_tailwind/static/src/css/tailwind.css" ]; then
        print_status "Tailwind CSS file exists ✓"
    else
        print_error "Tailwind CSS file not found. Run: $0 build"
        return 1
    fi
    
    print_status "Installation test completed successfully ✓"
}

# Watch mode for development
watch_tailwind() {
    print_header "Starting Tailwind CSS watch mode..."
    print_status "Watching for changes... Press Ctrl+C to stop"
    npm run watch
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     - Full installation (dependencies + build + start)"
    echo "  start       - Start Docker containers"
    echo "  stop        - Stop Docker containers"
    echo "  restart     - Restart Docker containers"
    echo "  status      - Show container status"
    echo "  logs [svc]  - View logs (default: odoo, options: odoo, db, nginx, node)"
    echo "  build       - Build Tailwind CSS"
    echo "  watch       - Watch Tailwind CSS for changes"
    echo "  test        - Test the installation"
    echo "  addon       - Show instructions to install the addon"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install     # Full setup"
    echo "  $0 logs odoo   # View Odoo logs"
    echo "  $0 watch       # Development mode"
}

# Main script logic
case "${1:-help}" in
    "install")
        check_docker
        check_docker_compose
        install_dependencies
        build_tailwind
        start_containers
        sleep 5
        test_installation
        install_addon
        ;;
    "start")
        check_docker
        start_containers
        ;;
    "stop")
        stop_containers
        ;;
    "restart")
        stop_containers
        sleep 2
        start_containers
        ;;
    "status")
        check_status
        ;;
    "logs")
        view_logs $2
        ;;
    "build")
        install_dependencies
        build_tailwind
        ;;
    "watch")
        install_dependencies
        watch_tailwind
        ;;
    "test")
        test_installation
        ;;
    "addon")
        install_addon
        ;;
    "help"|*)
        show_help
        ;;
esac
