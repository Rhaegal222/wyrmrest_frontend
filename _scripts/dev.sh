#!/bin/bash

#######################################
# Wyrmrest Frontend — Development Helper
#
# Avvia il server Angular in dev mode
# Eseguire sulla macchina host dalla root del progetto
#######################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status()  { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVICE_DIR="$SCRIPT_DIR/../service"

echo ""
echo "================================================"
echo "    Wyrmrest Frontend — Dev Server"
echo "================================================"
echo ""

print_status "Installazione dipendenze npm..."
cd "$SERVICE_DIR" && npm install
print_success "Dipendenze installate"

echo ""
print_status "Avvio Angular dev server su http://localhost:4200..."
echo ""

cd "$SERVICE_DIR" && npx ng serve --host 0.0.0.0 --port 4200
