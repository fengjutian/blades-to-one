#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        // 启用日志插件，用于调试
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Debug) // 将日志级别从Info调整为Debug
            .build(),
        )?;

        // 获取主窗口并打开开发者工具
        // Tauri 2.x版本中，get_window已更名为get_webview_window
        let main_window = app.get_webview_window("frontend").expect("找不到主窗口");

        // 自动打开开发者工具
        main_window.open_devtools()?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}



