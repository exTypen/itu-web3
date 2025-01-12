#!/usr/bin/env node
import MainMenu from './menus/main_menu';
import ServiceProvider from './providers/service_provider';


// MainMenu fonksiyonunu, seçilen altyapı ile çalışacak şekilde düzenle
async function startApp(): Promise<void> {
  ServiceProvider.setChain('sepolia');
  await MainMenu();
}

startApp().catch((err) => {
  console.error('An error occurred:', err);
  process.exit(1);
});
