use random::Source;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::Duration;

pub struct TauriThreadStorage {
  handle: Option<thread::JoinHandle<()>>,
  stopped: Arc<AtomicBool>,
}

impl TauriThreadStorage {
  pub fn new() -> Self {
    Self {
      handle: Default::default(),
      stopped: Arc::from(AtomicBool::from(false)),
    }
  }

  pub fn start_thread(&mut self, thread_name: String) -> () {
    let is_stopped = Arc::clone(&self.stopped);
    let mut rnd_src = random::default(42);
    self.stopped.store(false, Ordering::Relaxed);
    let handle = thread::spawn(move || {
      for i in 0..500 {
        let rnum = rnd_src.read::<u16>();
        println!("Thread:{} produced {}-th rand: {}", thread_name, i, rnum);
        if is_stopped.load(Ordering::Relaxed) {
          break;
        }
        thread::sleep(Duration::from_secs(1));
      }
      println!("Thread loop broken for {}", thread_name);
    });
    self.handle = Some(handle);
  }

  pub fn stop_thread(&mut self) -> bool {
    if self.handle.is_some() {
      self.stopped.store(true, Ordering::Relaxed);
      self.handle.take().unwrap().join().unwrap();
      self.handle = None;
      true
    } else {
      false
    }
  }
}
