// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod emitter;
mod taurithread;
mod udpserver;

use std::{collections::HashMap, sync::Mutex};
use tauri::{State, Window};
use taurithread::TauriThreadStorage;

// Here we use Mutex to achieve interior mutability
struct Storage {
  store: Mutex<HashMap<String, i32>>,
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save(storage: State<Storage>, propname: &str) -> String {
  storage.store.lock().unwrap().insert(propname.to_string(), 1 as i32);
  return format!("saved key {}", propname);
}

#[tauri::command]
fn query(storage: State<Storage>) -> String {
  let dict = storage.store.lock().unwrap();
  let joined = dict
        .iter()
        .map(|(key, _value)| format!("{}", key))
        .collect::<Vec<_>>()
        .join(", ");

  format!("{}", joined)
}

#[tauri::command]
fn start_thread(threadname: String, storage: State<Mutex<TauriThreadStorage>>) -> String {
  let stopped = storage.lock().unwrap().stop_thread();
  storage.lock().unwrap().start_thread(threadname);
  match stopped {
    true => format!("Stopped prev, started new"),
    false => format!("No prev, started new"),
  }
}

#[tauri::command]
fn stop_thread(storage: State<Mutex<TauriThreadStorage>>) -> String {
  match storage.lock().unwrap().stop_thread() {
    true => format!("Stopped thread"),
    false => format!("No running thread"),
  }
}

#[tauri::command]
fn clear_window() -> String {
  emitter::clear_target_window();
  format!("Cleared window")
}

#[tauri::command]
fn set_window(window: Window) -> String {
  emitter::set_target_window(window);
  format!("Set window")
}

fn main() {
  env_logger::init();

  // Create the runtime
  let mut runtime: tauri::async_runtime::RuntimeHandle = tauri::async_runtime::handle();
  udpserver::setup_udp_listening(&mut runtime);

  tauri::Builder::default()
    .manage(Storage { store: Default::default() })
    .manage(Mutex::new(TauriThreadStorage::new()))
    .invoke_handler(tauri::generate_handler![
      greet,
      save,
      query,
      start_thread,
      stop_thread,
      clear_window,
      set_window,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
