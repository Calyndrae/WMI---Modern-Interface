# ==============================
# WMI - Modern Interface Installer
# Windows 11 Only
# ==============================

# 强制切换到脚本所在目录（核心修复点）
Set-Location -Path $PSScriptRoot

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
    Write-Host ""
    Write-Host "1. 浏览器将自动打开"
    Write-Host "2. 请完成下载 / 安装"
    Write-Host "3. 完成后回到此窗口"
    Write-Host "4. 按任意键继续"
    Write-Host "----------------------------------------"
    Write-Host ""

    Start-Process $Url
    Pause
}

# ===== Step 1 =====
Open-Web-And-Wait `
    "https://github.com/Calyndrae/WMI---Modern-Interface/releases/latest" `
    "步骤 1：下载 WMI Modern Interface（Release 1.0）"

# ===== Finish =====
Write-Host ""
Write-Host "========================================"
Write-Host "WMI 安装流程已完成"
Write-Host ""
Write-Host "如果界面未生效："
Write-Host "- 请刷新网站"
Write-Host "- 或重新打开浏览器"
Write-Host "========================================"
Pause
