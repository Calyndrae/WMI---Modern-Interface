' Westlake Modern Interface (WMI) - Step-by-Step Installer
' Developed by Calyndrae & Gemini

Set shell = CreateObject("WScript.Shell")

Dim repoRaw, folder, scripts, script, choice

repoRaw = "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/"
folder = "Tempermonkey%20Scripts/"

' Your official 10-script list
scripts = Array(_
    "WMI%20-%20%22Other%22%20Window.user.js", _
    "WMI%20-%20Blank%20Subject%20Block%20Fix.user.js", _
    "WMI%20-%20Clock.user.js", _
    "WMI%20-%20Current%20Subject%20Block.user.js", _
    "WMI%20-%20Guides.user.js", _
    "WMI%20-%20Profile%20Customizer.user.js", _
    "WMI%20-%20Subject%20Interaction.user.js", _
    "WMI%20-%20Subject%20Tracker.user.js", _
    "WMI%20-%20Other%20Scripts.user.js", _
    "WMI%20-%20Web%20Edit%20Belonging%20Info.user.js" _
)

MsgBox "Welcome to the WMI Step-by-Step Installer." & vbCrLf & vbCrLf & _
       "How it works:" & vbCrLf & _
       "1. A browser window will open for a script." & vbCrLf & _
       "2. Click 'Install' or 'Update' in your browser." & vbCrLf & _
       "3. Come back to THIS window and click OK for the next one." & vbCrLf & vbCrLf & _
       "Press OK to begin Step 1.", vbInformation, "WMI Installer"

' --- THE LOOP ---
Dim count
count = 1

For Each script In scripts
    ' Open the script in the default browser
    shell.Run repoRaw & folder & script
    
    ' Pause the script and wait for the user to click OK
    choice = MsgBox("Step " & count & " of 10 is open in your browser." & vbCrLf & vbCrLf & _
                    "Script: " & Replace(script, "%20", " ") & vbCrLf & vbCrLf & _
                    "Once you have clicked 'Install', click OK here to move to the next script.", _
                    vbOKCancel + vbQuestion, "WMI Progress")
    
    ' If the user clicks Cancel, stop the whole installer
    If choice = vbCancel Then 
        MsgBox "Installation paused. You can restart the installer anytime.", vbExclamation, "WMI"
        WScript.Quit
    End If
    
    count = count + 1
Next

' --- STYLEBOT FINAL STEP ---
MsgBox "All scripts are done!" & vbCrLf & vbCrLf & _
       "Now, please open your SCHOOL PORTAL first, open Stylebot extention, and now press next, to open the Stylebot CSS code. Please Copy and Paste it into Stylebot.on the SCHOOL PORTAL WEBSITE", vbInformation, "Final Step"

shell.Run "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Stylebot/WMI%20-%20Global%20Main%20Theme.css"

MsgBox "Installation Complete! Refresh your school page to see the magic.", vbInformation, "Done!"
