#!/bin/zsh

# Westlake Modern Interface (WMI) - macOS Installer
# Created by Calyndrae & Gemini

# Clear terminal screen
clear

echo "================================================"
echo "      WMI - macOS Intelligent Installer         "
echo "================================================"
echo ""
echo "This will install 10 Tampermonkey scripts."
echo "1. A tab will open in your browser."
echo "2. Click 'Install' or 'Update'."
echo "3. Return to this window and press ENTER."
echo ""
echo "Press ENTER to begin..."
read

REPO="https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts"

# The official script list
SCRIPTS=(
    "WMI%20-%20%22Other%22%20Window.user.js"
    "WMI%20-%20Blank%20Subject%20Block%20Fix.user.js"
    "WMI%20-%20Clock.user.js"
    "WMI%20-%20Current%20Subject%20Block.user.js"
    "WMI%20-%20Guides.user.js"
    "WMI%20-%20Profile%20Customizer.user.js"
    "WMI%20-%20Subject%20Interaction.user.js"
    "WMI%20-%20Subject%20Tracker.user.js"
    "WMI%20-%20Virable%20NamePlaceHolder.user.js"
    "WMI%20-%20Web%20Edit%20Belonging%20Info.user.js"
)

count=1
for s in "${SCRIPTS[@]}"; do
    # Convert %20 back to spaces for the display name
    display_name=$(echo $s | sed 's/%20/ /g' | sed 's/%22/"/g')
    
    echo "------------------------------------------------"
    echo "[$count/10] Installing: $display_name"
    
    # Open the URL in the default browser
    open "$REPO/$s"
    
    # Wait for the user to finish in the browser
    echo "Action: Click 'Install' in your browser, then press [ENTER] here..."
    read
    
    ((count++))
done

echo "------------------------------------------------"
echo "✅ Tampermonkey scripts complete!"
echo "Opening Stylebot CSS code... Copy/Paste this into Stylebot."
open "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Stylebot/WMI%20-%20Global%20Main%20Theme.css"

echo ""
echo "✨ Installation Finished! Refresh your school website."
echo "Press ENTER to close this window."
read
exit
