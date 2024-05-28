// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod emitter;
mod taurithread;
mod udpserver;

use std::{collections::HashMap, sync::Mutex};
use serde::{Deserialize, Serialize};
use tauri::{State, Window};
use taurithread::TauriThreadStorage;

// Here we use Mutex to achieve interior mutability
struct Storage {
  store: Mutex<HashMap<String, i32>>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CityInfo {
  pub name: String,
  pub country: String,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum PayloadPreference {
  PreferSelf,
  PreferYear(i32),
  PreferCity(CityInfo),
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct DemoPayload {
  pub first_name: String,
  pub address: String,
  pub pref: PayloadPreference,
}

#[tauri::command]
fn greet(name: &str) -> DemoPayload {
  let pref =  PayloadPreference::PreferCity(CityInfo{
    name: "Tokyo".to_string(),
    country: "Japan".to_string(),
  });
  let p = DemoPayload {
    first_name: name.to_string(),
    address: "San Francisco".to_string(),
    pref,
  };
  p
  //let serialized = serde_json::to_string(&p).unwrap();
  // format!("You've been greeted from Rust!: {}", serialized)
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
