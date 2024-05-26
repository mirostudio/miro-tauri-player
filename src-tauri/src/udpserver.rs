
use std::io::{Error, ErrorKind, Result};

use serde::{Deserialize, Serialize};
use tauri::async_runtime::RuntimeHandle;
use tokio::net::UdpSocket;

use crate::emitter::emit_event_to_fe;

#[derive(Serialize, Deserialize, Debug)]
struct AppMessage {
  code: String,
  timestamp: i32,
}

fn log_bytes(size: usize, ubuffer: &[u8]) -> Result<AppMessage> {
  let json_msg = match String::from_utf8(ubuffer[0..(size)].to_vec()) {
    Ok(msg) => msg,
    Err(error) => {
      return Err(Error::new(ErrorKind::InvalidData, format!("Failed to parse UTF8: {:?}", error.utf8_error())));
    },
  };
  
  let deserialized: AppMessage = serde_json::from_str(&json_msg)?;
  println!("deserialized = {:?}", deserialized);
  Ok(deserialized)
}



async fn read_udp_loop() -> Result<()> {
  let sock = UdpSocket::bind("0.0.0.0:8080").await?;
  let mut buf = [0; 1024];
  loop {
      let (len, addr) = sock.recv_from(&mut buf).await?;
      //println!("{:?} bytes received from {:?}", len, addr);
      let mut app_msg = log_bytes(len, &buf)?;

      app_msg.code = "BAR".to_string();
      app_msg.timestamp = 987654321;

      let serialized = serde_json::to_string(&app_msg)?;

      let bytes = serialized.as_bytes();
      let sent_bytes = sock.send_to(bytes, addr).await?;
      println!("{:?} bytes sent", sent_bytes);

      emit_event_to_fe("FOO".to_string());
  }
}

pub fn setup_udp_listening(rt: &mut RuntimeHandle) -> () {
  rt.spawn(async move {
    read_udp_loop().await.unwrap();
  });
}
