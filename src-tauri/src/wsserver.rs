
// nuse lazy_static::lazy_static;
use tauri::async_runtime::RuntimeHandle;
use tokio::{io::AsyncReadExt, net::{TcpListener, TcpStream}};
use tokio_tungstenite;

pub struct WSServer {
}

impl WSServer {
  pub fn new() -> Self {
    Self {}
  }

  pub fn start_listen_loop(&self) -> () {
  }

  pub fn stop_listen_loop(&self) -> () {
  }
}

//===========================================================

async fn accept_connection(stream: TcpStream) {
  let addr = stream.peer_addr().expect("connected streams should have a peer address");
  println!("Peer address: {}", addr);

  let mut ws_stream: tokio_tungstenite::WebSocketStream<TcpStream> = tokio_tungstenite::accept_async(stream)
      .await
      .expect("Failed to accept");

  let (mut ws_read, mut _ws_write) = ws_stream.get_mut().split();
  println!("Connected, Peer address: {}", addr);


  let mut ubuffer: [u8; 1024] = [0; 1024]; // Initialize with zeros
  // let mut buffer = String::new();

  /*
  loop {
    match ws_read.read_to_string(&mut buffer).await {
      Ok(size) => {
        if size > 0 {
          println!("Got buffer of len {} := {:?}", size, buffer);
        }
      },
      Err(err) => {
        println!("Got error = {:?}", err);
        break;
      }
    }  
  }
  */

  loop {
    match ws_read.read(&mut ubuffer).await {
      Ok(size) => {
        if size > 0 {
          println!("Got buffer of len {} := {:?}", size, ubuffer);
          match String::from_utf8(ubuffer[0..(size+1)].to_vec()) {
            Ok(msg) => {
              println!("Msg = {}", msg);
            },
            Err(err) => {
              println!("Got UTF-8 conversion error = {:?}", err);
            },
          }
        }
      },
      Err(err) => {
        println!("Got error = {:?}", err);
        break;
      }
    }  
  }





}

async fn listed_web_socket_and_gen_loop<F>(handle_conn: F) -> ()
where F: Fn(TcpStream) -> () {
  let addr = "127.0.0.1:3001".to_string();

  // Create the event loop and TCP listener we'll accept connections on.
  let try_socket = TcpListener::bind(&addr).await;
  let listener = try_socket.expect("Failed to bind");
  println!("Listening on: {}", addr);

  while let Ok((stream, _)) = listener.accept().await {
    handle_conn(stream);
  }
}

pub fn setup_websocket_listening(rt: &mut RuntimeHandle) -> () {
  let rt_clone = rt.clone();
  rt.spawn(async move {
    println!("Now running on a worker thread in Tauri !!");
    listed_web_socket_and_gen_loop(move |stream| {
      rt_clone.spawn(accept_connection(stream));
    }).await;
  });
}
