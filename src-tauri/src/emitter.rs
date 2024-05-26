use std::{io::Error as StdError, sync::Mutex};

use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};
use tauri::{Error, Result, Window};

struct AppEventEmitter {
  win: Option<Window>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AppMessage {
  pub code: String,
  pub timestamp: i32,
}

impl AppEventEmitter {
  pub fn clear_target(&mut self) -> () {
    self.win = None;
  }

  pub fn set_target(&mut self, window: Window) -> () {
    self.win = Some(window);
  }

  pub fn try_emit_to_window(&mut self, code: String, payload: AppMessage) -> Result<()> {
    let Some(window) = self.win.as_mut() else {
      return Err(Error::Io(StdError::other("window not set")));
    };
    window.emit(code.as_str(), payload)?;
    Ok(())
  }
}

fn global_data() -> &'static Mutex<AppEventEmitter> {
  static INSTANCE: OnceCell<Mutex<AppEventEmitter>> = OnceCell::new();
  INSTANCE.get_or_init(|| {
      let m = AppEventEmitter{ win: None };
      Mutex::new(m)
  })
}

pub fn clear_target_window() {
  global_data().lock().unwrap().clear_target();
}

pub fn set_target_window(window: Window) {
  global_data().lock().unwrap().set_target(window);
}

pub fn emit_event_to_fe(code: String, payload: AppMessage) -> () {
  if let Err(error) = global_data().lock().unwrap().try_emit_to_window(code, payload) {
    println!("Error in emitting: {:?}", error);
  }
}
