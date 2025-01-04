#!/usr/bin/env node
import MainMenu from "./src/menus/main_menu.js";

console.log("Hello, Welcome to ITUChain!");

async function startApp() {
  await MainMenu()
}

// Uygulamayı başlat
startApp().catch((err) => {
  console.error("An error occurred:", err);
  process.exit(1);
});
