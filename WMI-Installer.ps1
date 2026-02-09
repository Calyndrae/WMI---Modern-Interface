# ==============================
# WMI - Modern Interface Installer
# Windows 11 Only
# ==============================

Clear-Host
$Host.UI.RawUI.WindowTitle = "WMI Installer"

function Open-Web-And-Wait {
    param (
        [string]$Url,
        [string]$Message
    )

    Write-Host ""
    Write-Host "----------------------------------------"
    Write-Host $Message
    Write-Host "浏览器即将打开，请完成下载"
    Write-Host "完成后回到此窗口，按任意键继续"
    Write-Host "----------------------------------------"
    Write-Host ""

    Start-Process $Url
    Pause
}

# ===== Step 1 =====
Open-Web-And-Wait `
    "https://github.com/Calyndrae/WMI---Modern-Interface/releases/latest" `
    "步骤 1：下载 WMI 主程序"

# ===== Step 2（如果你以后有第二个）=====
# Open-Web-And-Wait `
#     "https://example.com/second-download" `
#     "步骤 2：下载额外组件"

# ===== Finish =====
Write-Host ""
Write-Host "========================================"
Write-Host "所有步骤已完成"
Write-Host "你现在可以关闭此窗口"
Write-Host "========================================"
Pause
