// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{CustomMenuItem, SystemTrayMenuItem, Manager, SystemTray, SystemTrayEvent, WindowBuilder, WindowUrl, SystemTrayMenu, Wry, AppHandle, LogicalSize, Size};
use tauri_plugin_positioner::{Position, WindowExt, on_tray_event};

fn system_tray_menu() -> SystemTrayMenu {
    SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("dashboard", "Open Full Dashboard"))
        .add_item(CustomMenuItem::new("query_log", "Query Log"))
        .add_native_item(SystemTrayMenuItem::Separator)
        // .add_item(CustomMenuItem::new("settings".to_string(), "Open Settings")
        //     .accelerator("CmdOrCtrl+Shift+P")
        // )
        // .add_item(CustomMenuItem::new("hide_dock_icon", "Hide Dock Icon"))
        // .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("logout".to_string(), "Log out"))
        .add_item(CustomMenuItem::new("exit".to_string(), "Exit"))
}

fn create_settings_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "setting", WindowUrl::External("https://example.com/".parse().unwrap()))
        .inner_size(800.0, 500.0)
        .build()
        .unwrap();
    let _ = window.move_window(Position::Center);
}

fn create_dashboard_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "dashboard", WindowUrl::External("https://adguard-dns.io/en/dashboard/".parse().unwrap()))
        .inner_size(1200.0, 700.0)
        .always_on_top(true)
        .build()
        .unwrap();
    let _ = window.move_window(Position::Center);
    let _ = window.set_focus();
}

fn create_query_log_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "query_log", WindowUrl::App("http://localhost:1420/query_log".into()))
        .inner_size(600.0, 600.0)
        .always_on_top(true)
        .build()
        .unwrap();
    let _ = window.move_window(Position::Center);
    let _ = window.set_focus();
}

fn create_splash_screen(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "splash", WindowUrl::App("http://localhost:1420/splash".into()))
        .inner_size(370.0, 580.0)
        .always_on_top(true)
        .hidden_title(true)
        .resizable(false)
        .decorations(false)
        .build()
        .unwrap();
    let _ = window.show();
    let _ = window.move_window(Position::TrayCenter);
}

fn create_tray_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "label", WindowUrl::App("http://localhost:1420/tray".into()))
        .inner_size(350.0, 560.0)
        .always_on_top(true)
        .hidden_title(true)
        .resizable(false)
        .decorations(false)
        .build()
        .unwrap();
    let _ = window.show();
    let _ = window.move_window(Position::TrayCenter);
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct LogOut {
  flag: bool,
}

fn main() {
    println!("Start TAURI app");
    let system_tray = SystemTray::new().with_menu(system_tray_menu());
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {
            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event|
            match event {
            SystemTrayEvent::LeftClick { .. } => {
                on_tray_event(app, &event);
                match app.get_window("label") {
                    None => create_tray_window(app),
                    Some(label) => {
                        match label.is_visible().unwrap() {
                            true => {
                                let _ = label.hide();
                            }
                            false => {
                                let _ = label.show();
                                let _ = label.set_focus();
                            }
                        }
                    }
                };
            },
            SystemTrayEvent::RightClick { .. } => {
                on_tray_event(app, &event);
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "settings" => {
                        create_settings_window(app);
                    },
                    "query_log" => {
                        let _ = app.get_window("label").unwrap().hide();
                        create_query_log_window(app);
                    },
                    "dashboard" => {
                        create_dashboard_window(app);
                        // TODO: don't create new windows, run from backgroung
                        let _ = app.get_window("label").unwrap().hide();
                    },
                    "exit" => std::process::exit(0),
                    "logout" => {
                        app.emit_all("logout", LogOut { flag: true }).unwrap();
                    },
                    _ => ()
                }
            },
            _ => ()
        }
        )
        .invoke_handler(tauri::generate_handler![
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
