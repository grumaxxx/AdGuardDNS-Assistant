use tauri::{AppHandle, Window, Manager};

#[tauri::command]
pub async fn is_tray_window_active(app: AppHandle) -> bool {
  match app.get_window("tray_win") {
    None => {
      println!("Tray windows hasn't been started");
      return false;
    },
    Some(label) => {
      match label.is_visible().unwrap() {
        true => {return true;},
        false => {return false;}
      }
    }
  };
}

#[tauri::command]
pub async fn close_splashscreen(window: Window) {
  if let Some(splashscreen) = window.get_window("splashscreen") {
    println!("Close splashscreen");
    splashscreen.close().unwrap();
    let tray = window.get_window("tray_win").unwrap();
    let _ = tray.show();
    let _ = tray.set_focus();
  }
}