use log::{error, info};
use std::{path::PathBuf, path::Path, fs::{self, File}};

pub const APP_CONF_FILE_NAME: &str = "dns.conf.json";
pub const APP_PATH: &str = "AdGuard DNS Assistant";

macro_rules! pub_struct {
  ($name:ident {$($field:ident: $t:ty,)*}) => {
    #[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
    pub struct $name {
      $(pub $field: $t),*
    }
  }
}

pub_struct!(AppConf {
  tray_min_height: f64,
  tray_min_width: f64,
  tray_height: f64,
  tray_width: f64,
  dashboard_height: f64,
  dashboard_width: f64,
});

impl AppConf {

  pub fn new() -> Self {
    Self {
      tray_min_height: 560.0,
      tray_min_width: 350.0,
      tray_height: 560.0,
      tray_width: 350.0,
      dashboard_height: 700.0,
      dashboard_width: 1200.0,
    }
  }

  pub fn file_path() -> PathBuf {
    tauri::api::path::home_dir().unwrap().join(APP_PATH).join(APP_CONF_FILE_NAME)
  }

  pub fn read() -> Self {
    match fs::read_to_string(Self::file_path()) {
      Ok(value) => {
        if let Ok(v) = serde_json::from_str::<AppConf>(&value) {
          v
        } else {
          error!("conf_read_parse_error");
          Self::default()
        }
      },
      Err(err) => {
        error!("conf_read_error: {}", err);
        Self::default()
      }
    }
  }

  pub fn write(self) -> Self {
    let path = &Self::file_path();
    if !Path::new(path).exists() {
      if let Some(p) = path.parent() {
        fs::create_dir_all(p).unwrap();
      }
      File::create(path).unwrap();
      info!("Config created");
    }
    if let Ok(v) = serde_json::to_string_pretty(&self) {
      std::fs::write(path, v).unwrap_or_else(|err| {
        error!("Config write error: {}", err);
        Self::default().write();
      });
    } else {
      error!("Config error");
    }
    self
  }
}

impl Default for AppConf {
  fn default() -> Self {
    Self::new()
  }
}
