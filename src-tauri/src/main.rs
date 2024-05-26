// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod emitter;
mod taurithread;
mod udpserver;
mod wsserver;

use std::{collections::HashMap, sync::Mutex};
use tauri::State;
use taurithread::TauriThreadStorage;
use wsserver::WSServer;

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
fn start_ws(wsserver: State<Mutex<WSServer>>) -> String {
  wsserver.lock().unwrap().start_listen_loop();
  format!("Started websocket server")
}

#[tauri::command]
fn stop_ws(wsserver: State<Mutex<WSServer>>) -> String {
  wsserver.lock().unwrap().stop_listen_loop();
  format!("Stopped websocket server")
}

fn main() {
  env_logger::init();

  // Create the runtime
  let mut runtime: tauri::async_runtime::RuntimeHandle = tauri::async_runtime::handle();
  // wsserver::setup_websocket_listening(&mut runtime);
  udpserver::setup_udp_listening(&mut runtime);

  tauri::Builder::default()
    .manage(Storage { store: Default::default() })
    .manage(Mutex::new(TauriThreadStorage::new()))
    .manage(Mutex::new(WSServer::new()))
    .invoke_handler(tauri::generate_handler![
      greet,
      save,
      query,
      start_thread,
      stop_thread,
      start_ws,
      stop_ws,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
