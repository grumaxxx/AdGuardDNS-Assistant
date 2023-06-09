// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
mod conf;

use app::{cmd, tray};
use conf::AppConf;

use log::trace;
use tauri::{SystemTray};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_log::{
    fern::colors::{Color, ColoredLevelConfig},
    LogTarget,
  };

#[tokio::main]
async fn main() {
    let _app_conf = AppConf::read().write();

    let mut log = tauri_plugin_log::Builder::default()
    .targets([
        LogTarget::LogDir,
        LogTarget::Stdout,
        LogTarget::Webview,
    ])
    .level(log::LevelFilter::Debug);

    if cfg!(debug_assertions) {
        log = log.with_colors(ColoredLevelConfig {
        error: Color::Red,
        warn: Color::Yellow,
        debug: Color::Blue,
        info: Color::BrightGreen,
        trace: Color::Cyan,
        });
    }
    trace!("Create tray window");
    let mut system_tray = SystemTray::new().with_menu(tray::system_tray_menu());
    #[cfg(target_os = "macos")] 
    {
        system_tray = system_tray.with_icon(tauri::Icon::Raw(include_bytes!("../icons/tray_icon.png").to_vec()));
    }
    let mut app = tauri::Builder::default()
        .plugin(log.build())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None
        ))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|_app| {
            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(tray::tray_handler)
        .invoke_handler(tauri::generate_handler![
            cmd::is_tray_window_active,
            cmd::close_splashscreen
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Accessory);
    app.run(|_app_handle, _event| {});
}
