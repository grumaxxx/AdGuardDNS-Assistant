use super::window;

use tauri::{AppHandle, SystemTrayEvent, Manager, SystemTrayMenu, CustomMenuItem, SystemTrayMenuItem,};
use tauri_plugin_positioner::{WindowExt, Position, on_tray_event};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

#[derive(Clone, serde::Serialize)]
struct LogOut {
  flag: bool,
}

pub fn tray_handler(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            on_tray_event(app, &event);
            match app.get_window("tray") {
                None => {
                    window::create_tray_window(app);
                    window::create_splash_screen(app);
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
                    window::create_settings_window(app);
                },
                "query_log" => {
                    let _ = app.get_window("tray").unwrap().hide();
                    window::create_query_log_window(app);
                },
                "dashboard" => {
                    let _ = app.get_window("tray").unwrap().hide();
                    match app.get_window("dashboard")
                    {
                        None => {
                            window::create_dashboard_window(app);
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

pub fn system_tray_menu() -> SystemTrayMenu {
  SystemTrayMenu::new()
      .add_item(CustomMenuItem::new("dashboard", "Open Full Dashboard"))
    //   .add_item(CustomMenuItem::new("query_log", "Query Log"))
      .add_native_item(SystemTrayMenuItem::Separator)
    //   .add_item(CustomMenuItem::new("settings".to_string(), "Open Settings")
    //       .accelerator("CmdOrCtrl+Shift+P")
    //   )
    //   .add_native_item(SystemTrayMenuItem::Separator)
      .add_item(CustomMenuItem::new("logout".to_string(), "Log out"))
      .add_item(CustomMenuItem::new("exit".to_string(), "Exit"))
}
