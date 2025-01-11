#!/usr/bin/env node
import MainMenu from './menus/main_menu';
import ServiceProvider from './providers/service_provider';

// Komut satırı argümanlarını kontrol et
const args = process.argv;
const isFirebase = args.includes('firebase');

// MainMenu fonksiyonunu, seçilen altyapı ile çalışacak şekilde düzenle
async function startApp(): Promise<void> {
  ServiceProvider.setServices(isFirebase);
  await MainMenu();
}

startApp().catch((err) => {
  console.error('An error occurred:', err);
  process.exit(1);
});
