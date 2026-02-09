# ==================================================
# Westlake Modern Interface (WMI)
# Interactive PowerShell Setup Wizard (Safe Edition)
# ==================================================

Add-Type -AssemblyName System.Windows.Forms

# -------------------------
# Config
# -------------------------
$RepoRaw = "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/"
$TmFolder = "Tempermonkey%20Scripts/"
$SbFolder = "Stylebot/"

$Scripts = @(
    "WMI%20-%20%22Other%22%20Window.user.js",
    "WMI%20-%20Blank%20Subject%20Block%20Fix.user.js",
    "WMI%20-%20Clock.user.js",
    "WMI%20-%20Current%20Subject%20Block.user.js",
    "WMI%20-%20Guides.user.js",
    "WMI%20-%20Profile%20Customizer.user.js",
    "WMI%20-%20Subject%20Interaction.user.js",
    "WMI%20-%20Subject%20Tracker.user.js",
    "WMI%20-%20Variable%20NamePlaceholder.user.js",
    "WMI%20-%20Web%20Edit%20Belonging%20Info.user.js"
)

$CssFile = "WMI%20-%20Global%20Main%20Theme.css"

$InstallTimeLimit = 25  # seconds allowed per script

# -------------------------
# Helpers
# -------------------------
function InfoBox($msg, $title="WMI Installer") {
    [System.Windows.Forms.MessageBox]::Show(
        $msg,
        $title,
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Information
    ) | Out-Null
}

function ConfirmBox($msg, $title="WMI Installer") {
    return [System.Windows.Forms.MessageBox]::Show(
        $msg,
        $title,
        [System.Windows.Forms.MessageBoxButtons]::YesNo,
        [System.Windows.Forms.MessageBoxIcon]::Question
    )
}

function Get-EdgePath {
    $paths = @(
        "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
        "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

# -------------------------
# Intro
# -------------------------
InfoBox @"
Welcome to Westlake Modern Interface (WMI) Setup Wizard.

This installer will:
• Open ONE script at a time
• Automatically close the install window
• Prevent messy tabs for beginners

Please follow on-screen instructions carefully.
"@

# -------------------------
# Checklist (shown early)
# -------------------------
InfoBox @"
INSTALLATION CHECKLIST

☐ Tampermonkey installed
☐ Default browser ready
☐ You will click 'Install' when prompted
☐ Do NOT close this installer window
☐ Wait until each step confirms completion
"@ "WMI – Checklist"

# -------------------------
# Environment Check
# -------------------------
$tmCheck = ConfirmBox "Do you already have Tampermonkey installed?`n`n(This cannot be auto-detected)"

if ($tmCheck -eq "No") {
    Start-Process "https://www.tampermonkey.net/"
    InfoBox "Please install Tampermonkey first, then run this installer again."
    exit
}

$EdgePath = Get-EdgePath
if (-not $EdgePath) {
    InfoBox "Microsoft Edge was not found.`n`nThis installer requires Edge for safe window handling."
    exit
}

# -------------------------
# Install Scripts One by One
# -------------------------
$total = $Scripts.Count
$step = 1

foreach ($script in $Scripts) {

    $url = "$RepoRaw$TmFolder$script"

    InfoBox @"
Step $step of $total

A special install window will open.

WHAT TO DO:
1. Click 'Install' in Tampermonkey
2. Wait — the window will close automatically
3. Return here and continue

You have $InstallTimeLimit seconds.
"@ "Installing Script $step"

    Start-Process $EdgePath "--new-window --app=$url"

    Start-Sleep -Seconds $InstallTimeLimit

    # Close only Edge app-style windows (safe close)
    Get-Process msedge -ErrorAction SilentlyContinue |
    Where-Object {
        $_.MainWindowTitle -and
        ($_.MainWindowTitle -like "*Tampermonkey*" -or $_.MainWindowTitle -like "*WMI*")
    } |
    ForEach-Object {
        $_.CloseMainWindow() | Out-Null
    }

    InfoBox "Step $step completed.`nIf you missed it, the page will reopen next step."

    $step++
}

# -------------------------
# Stylebot CSS Step
# -------------------------
InfoBox @"
All scripts installed!

FINAL CHECKLIST:
☐ Opened Stylebot
☐ Copied ALL CSS
☐ Pasted into Stylebot
☐ Saved changes
"@ "Final Step – Stylebot"

Start-Process $EdgePath "--new-window --app=$RepoRaw$SbFolder$CssFile"

InfoBox "✨ WMI setup complete!`n`nPlease refresh your school website."
