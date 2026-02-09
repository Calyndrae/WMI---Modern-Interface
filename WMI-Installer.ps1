' =========================================
' WMI - Modern Interface Installer (VBScript)
' Requires Administrator Privileges
' =========================================

If Not IsAdmin() Then
    RequestAdmin
    WScript.Quit
End If

Dim shell
Set shell = CreateObject("WScript.Shell")

MsgBox "欢迎使用 WMI Modern Interface 安装器" & vbCrLf & vbCrLf & _
       "接下来将引导你完成安装。" & vbCrLf & _
       "请按提示操作即可。", _
       vbInformation, "WMI Installer"

' ===== Step 1 =====
shell.Run "https://github.com/Calyndrae/WMI---Modern-Interface/releases/latest"

MsgBox "步骤 1 / 1" & vbCrLf & vbCrLf & _
       "浏览器已打开。" & vbCrLf & _
       "请完成下载 / 安装。" & vbCrLf & vbCrLf & _
       "完成后，点击【确定】继续。", _
       vbOKOnly + vbInformation, "WMI Installer"

MsgBox "安装流程已完成！" & vbCrLf & vbCrLf & _
       "如果界面未生效，请刷新网站或重新打开浏览器。", _
       vbInformation, "完成"

' ===== Functions =====
Function IsAdmin()
    On Error Resume Next
    CreateObject("Shell.Application").ShellExecute "cmd.exe", "/c echo admin", "", "runas", 0
    If Err.Number = 0 Then
        IsAdmin = True
    Else
        IsAdmin = False
    End If
    Err.Clear
End Function

Sub RequestAdmin()
    CreateObject("Shell.Application").ShellExecute _
        "wscript.exe", """" & WScript.ScriptFullName & """", "", "runas", 1
End Sub
