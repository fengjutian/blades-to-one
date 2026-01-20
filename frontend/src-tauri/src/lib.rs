use tauri::Manager; // 导入Manager trait以使用get_webview_window方法

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
        // Tauri 2.x版本中，窗口默认标识符是"main"，frontend是窗口标题
        if let Some(main_window) = app.get_webview_window("main") {
          // 自动打开开发者工具，open_devtools()不返回Result类型，不能使用?
          main_window.open_devtools();
        } else {
          println!("警告：未找到主窗口，可能需要在tauri.conf.json中配置label为'main'");
        }
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}




