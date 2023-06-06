import { invoke } from '@tauri-apps/api/tauri'
import { message } from "antd"

export const messageIfVisible = async (type: 'success' | 'error' | 'info' | 'warning' | 'loading', msg: string) => {
  const isActive: boolean = await invoke('is_tray_window_active');
  if (isActive) {
    message[type](msg);
  }
}