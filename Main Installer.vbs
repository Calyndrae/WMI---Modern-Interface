' Westlake Modern Interface (WMI) - Intelligent Setup Wizard
' Developed by Calyndrae & Gemini

Set shell = CreateObject("WScript.Shell")

Dim repoRaw, tmFolder, sbFolder, tmScripts, cssFile, choice, step1, step2

' Base Paths
repoRaw = "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/"
tmFolder = "Tempermonkey%20Scripts/"
sbFolder = "Stylebot/"

' Script List
tmScripts = Array(_
    "WMI%20-%20%22Other%22%20Window.user.js", _
    "WMI%20-%20Blank%20Subject%20Block%20Fix.user.js", _
    "WMI%20-%20Clock.user.js", _
    "WMI%20-%20Current%20Subject%20Block.user.js", _
    "WMI%20-%20Guides.user.js", _
    "WMI%20-%20Profile%20Customizer.user.js", _
    "WMI%20-%20Subject%20Interaction.user.js", _
    "WMI%20-%20Subject%20Tracker.user.js", _
    "WMI%20-%20Virable%20NamePlaceHolder.user.js", _
    "WMI%20-%20Web%20Edit%20Belonging%20Info.user.js" _
)

cssFile = "WMI%20-%20Global%20Main%20Theme.css"

' --- STEP 1: Check for Tampermonkey ---
step1 = MsgBox("Step 1: Do you have the Tampermonkey extension installed?" & vbCrLf & _
    "(This is the engine required to run the scripts)", vbYesNo + vbQuestion, "WMI Environment Check")

If step1 = vbNo Then
    MsgBox "Opening Tampermonkey website... Please install it and then run this installer again.", vbInformation, "Redirecting..."
    shell.Run "https://www.tampermonkey.net/"
    WScript.Quit
End If

' --- STEP 2: Check for Stylebot ---
step2 = MsgBox("Step 2: Do you have the Stylebot extension installed?" & vbCrLf & _
    "(This is required for the visual theme/CSS)", vbYesNo + vbQuestion, "WMI Environment Check")

If step2 = vbNo Then
    MsgBox "Opening Stylebot website... Please install it and then run this installer again.", vbInformation, "Redirecting..."
    shell.Run "https://stylebot.dev/"
    WScript.Quit
End If

' --- STEP 3: Main Installation ---
choice = MsgBox("Environment Check Passed! Ready to install 10 core scripts." & vbCrLf & _
    "Click [OK] and then click 'Install' on each browser tab that opens.", vbOKCancel + vbInformation, "WMI Start Installation")

If choice = vbOK Then
    ' Open each script link
    For Each script In tmScripts
        shell.Run repoRaw & tmFolder & script
        WScript.Sleep 1000 ' 1 second delay to prevent browser crash
    Next
    
    ' Guide for CSS
    MsgBox "Scripts sent to browser!" & vbCrLf & vbCrLf & _
        "Final Step: We will now open the Stylebot Theme Code." & vbCrLf & _
        "Please [Select All] (Ctrl+A), [Copy], and [Paste] it into your Stylebot extension.", vbInformation, "Last Step: CSS Theme"
    
    shell.Run repoRaw & sbFolder & cssFile

    MsgBox "✨ WMI Setup is complete!" & vbCrLf & vbCrLf & _
        "Please refresh your school website to see the new interface.", vbInformation, "Installation Finished"
Else
    MsgBox "Installation Cancelled.", vbExclamation, "WMI"
End If
