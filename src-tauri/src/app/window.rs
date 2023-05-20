use tauri::{WindowBuilder, WindowUrl, Wry, AppHandle};
use tauri_plugin_positioner::{Position, WindowExt };

pub fn create_tray_window(app: &AppHandle<Wry>) {
  let window = WindowBuilder::new(app, "tray", WindowUrl::App("index.html?type=tray".into()))
      .inner_size(350.0, 560.0)
      .always_on_top(true)
      .resizable(false)
      .decorations(false)
      .build()
      .unwrap();
  window.move_window(Position::TrayCenter).unwrap();
}

pub fn create_splash_screen(app: &AppHandle<Wry>) {
  let window = WindowBuilder::new(app, "splashscreen", WindowUrl::App("index.html?type=splash_screen".into()))
      .inner_size(350.0, 560.0)
      .always_on_top(true)
      .resizable(false)
      .decorations(false)
      .build()
      .unwrap();
  let _ = window.show();
  let _ = window.move_window(Position::TrayCenter);
}

pub fn create_query_log_window(app: &AppHandle<Wry>) {
  let window = WindowBuilder::new(app, "query_log", WindowUrl::App("index.html/?type=query_log".into()))
      .inner_size(600.0, 600.0)
      .always_on_top(true)
      .title("AdGuard DNS Query Log")
      .build()
      .unwrap();
  let _ = window.move_window(Position::Center);
  let _ = window.set_focus();
}

pub fn create_dashboard_window(app: &AppHandle<Wry>) {
  let window = WindowBuilder::new(app, "dashboard", WindowUrl::External("https://adguard-dns.io/en/dashboard/".parse().unwrap()))
      .inner_size(1200.0, 700.0)
      .always_on_top(true)
      .title("AdGuard DNS Dashboard")
      .build()
      .unwrap();
  let _ = window.move_window(Position::Center);
  let _ = window.set_focus();
}

pub fn create_settings_window(app: &AppHandle<Wry>) {
  let window = WindowBuilder::new(app, "setting", WindowUrl::External("index.html/type=settings".parse().unwrap()))
      .inner_size(800.0, 500.0)
      .build()
      .unwrap();
  let _ = window.move_window(Position::Center);
}
