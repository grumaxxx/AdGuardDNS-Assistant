use tauri::{WindowBuilder, WindowUrl, Wry, AppHandle};
use tauri_plugin_positioner::{Position, WindowExt };
use crate::AppConf;

pub fn create_tray_window(app: &AppHandle<Wry>) {
  let app_conf = AppConf::read();
  let builder = WindowBuilder::new(app, "tray_win", WindowUrl::App("index.html?type=tray".into()))
      .decorations(false)
      .inner_size(app_conf.tray_width, app_conf.tray_height)
      .always_on_top(true)
      .visible(false)
      .skip_taskbar(true)
      .min_inner_size(app_conf.tray_min_width, app_conf.tray_min_height)
      .resizable(false);
  let window = builder.build().unwrap();
  window.move_window(Position::TrayCenter).unwrap();
}

pub fn create_splash_screen(app: &AppHandle<Wry>) {
  let app_conf = AppConf::read();
  let window = WindowBuilder::new(app, "splashscreen", WindowUrl::App("index.html?type=splash_screen".into()))
      .inner_size(app_conf.tray_width, app_conf.tray_height)
      .always_on_top(true)
      .resizable(false)
      .decorations(false)
      .visible(false)
      .build()
      .unwrap();
    let _ = window.move_window(Position::TrayCenter);
    let _ = window.show();
}

pub fn create_query_log_window(app: &AppHandle<Wry>) {
  let window = WindowBuilder::new(app, "query_log", WindowUrl::App("index.html/?type=query_log".into()))
      .inner_size(600.0, 600.0)
      .title("AdGuard DNS Query Log")
      .build()
      .unwrap();
  let _ = window.move_window(Position::Center);
  let _ = window.set_focus();
}

pub fn create_dashboard_window(app: &AppHandle<Wry>) {
  let app_conf = AppConf::read();
  let window = WindowBuilder::new(app, "dashboard", WindowUrl::External("https://adguard-dns.io/en/dashboard/".parse().unwrap()))
      .inner_size(app_conf.dashboard_width, app_conf.dashboard_height)
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
