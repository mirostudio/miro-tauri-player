// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod taurithread;

use std::{collections::HashMap, sync::Mutex};
use tauri::State;
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

pub struct TauriThreadStorage2 {
  pub handle: Mutex<Option<std::thread::JoinHandle<()>>>,
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


fn main() {
  tauri::Builder::default()
    .manage(Storage { store: Default::default() })
    .manage(Mutex::new(TauriThreadStorage::new()))
    .invoke_handler(tauri::generate_handler![
      greet,
      save,
      query,
      start_thread,
      stop_thread,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
