#!/usr/bin/env node
import MainMenu from './menus/main_menu';

console.log('Hello, Welcome to ITUChain!');

async function startApp(): Promise<void> {
  await MainMenu();
}

startApp().catch((err) => {
  console.error('An error occurred:', err);
  process.exit(1);
});
