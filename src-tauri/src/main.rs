// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{CustomMenuItem, SystemTrayMenuItem, Manager, SystemTray, SystemTrayEvent, WindowBuilder, WindowUrl, SystemTrayMenu, Wry, AppHandle};
use tauri_plugin_positioner::{Position, WindowExt, on_tray_event};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

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
    let window = WindowBuilder::new(app, "setting", WindowUrl::External("index.html/type=settings".parse().unwrap()))
        .inner_size(800.0, 500.0)
        .build()
        .unwrap();
    let _ = window.move_window(Position::Center);
}

fn create_dashboard_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "dashboard", WindowUrl::External("https://adguard-dns.io/en/dashboard/".parse().unwrap()))
        .inner_size(1200.0, 700.0)
        .always_on_top(true)
        .title("AdGuard DNS Dashboard")
        .build()
        .unwrap();
    let _ = window.move_window(Position::Center);
    let _ = window.set_focus();
}

fn create_query_log_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "query_log", WindowUrl::App("index.html/?type=query_log".into()))
        .inner_size(600.0, 600.0)
        .always_on_top(true)
        .title("AdGuard DNS Query Log")
        .build()
        .unwrap();
    let _ = window.move_window(Position::Center);
    let _ = window.set_focus();
}

fn create_splash_screen(app: &AppHandle<Wry>) {
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

fn create_tray_window(app: &AppHandle<Wry>) {
    let window = WindowBuilder::new(app, "tray", WindowUrl::App("index.html?type=tray".into()))
        .inner_size(350.0, 560.0)
        .always_on_top(true)
        .resizable(false)
        .decorations(false)
        .build()
        .unwrap();
    // let _ = window.open_devtools();
    let _ = window.move_window(Position::TrayCenter);
}

#[derive(Clone, serde::Serialize)]
struct LogOut {
  flag: bool,
}

#[tauri::command]
async fn is_tary_window_active(app: tauri::AppHandle) -> bool {
    match app.get_window("tray") {
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
async fn close_splashscreen(window: tauri::Window) {
  println!("Close splashscreen");
  if let Some(splashscreen) = window.get_window("splashscreen") {
    splashscreen.close().unwrap();
  }
  window.get_window("tray").unwrap().show().unwrap();
}

fn tray_handler(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            on_tray_event(app, &event);
            match app.get_window("tray") {
                None => {
                    create_tray_window(app);
                    create_splash_screen(app);
                    let _ = app.save_window_state(StateFlags::all());
                },
                Some(label) => {
                    match label.is_visible().unwrap() {
                        true => {
                            let _ = label.hide();
                        }
                        false => {
                            let _ = label.move_window(Position::TrayCenter);
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
                    let _ = app.get_window("tray").unwrap().hide();
                    create_query_log_window(app);
                },
                "dashboard" => {
                    let _ = app.get_window("tray").unwrap().hide();
                    match app.get_window("dashboard")
                    {
                        None => {
                            create_dashboard_window(app);
                        },
                        Some(_dashboard) => {
                            unimplemented!();
                        }
                    }
                }
                "exit" => std::process::exit(0),
                "logout" => {
                    app.emit_all("logout", LogOut { flag: true }).unwrap();
                },
                _ => ()
            }
        },
        _ => ()
    }
}

#[tokio::main]
async fn main() {
    let system_tray = SystemTray::new().with_menu(system_tray_menu());
    let mut app = tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|_app| {
            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(tray_handler)
        .invoke_handler(tauri::generate_handler![
            is_tary_window_active,
            close_splashscreen
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Accessory);
    app.run(|_app_handle, _event| {});
}
