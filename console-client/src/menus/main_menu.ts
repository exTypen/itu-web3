import inquirer from 'inquirer';
import authManager from '../managers/auth_manager';
import ItuScanMenu from './ituscan_menu';
import WalletMenu from './wallet_menu';
import PoolsMenu from './pools_menu';
import ServiceProvider from '../providers/service_provider';
import chalk from 'chalk';
import { printHeader } from '../utils/header_utils';

async function MainMenu(): Promise<void> {
  console.clear();
  printHeader();

  if (!authManager.isLoggedIn() && authManager.hasStoredWallet()) {
    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Enter your password to unlock your wallet:',
      },
    ]);

    const success = await authManager.loadWallet(password);
    if (!success) {
      console.log('Invalid password or corrupted data!');
    } else {
      console.clear();
      printHeader();
    }
  }

  const choices: any[] = [
    { name: 'My Balances', disabled: !authManager.isLoggedIn() },
    { name: 'ITUScan' },
    { name: 'Pools' },
    { name: 'Change Chain' },
  ];

  authManager.isLoggedIn()
    ? choices.push({ name: 'Disconnect' })
    : choices.push({ name: 'Initialize Wallet' });

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Main Menu',
      choices: choices,
    },
  ]);

  if (choice === 'My Balances') {
    const publicKey = authManager.getPublicKey();
    if (publicKey) {
      await WalletMenu(publicKey);
    }
    await MainMenu();
  } else if (choice === 'ITUScan') {
    await ItuScanMenu();
    await MainMenu();
  } else if (choice === 'Pools') {
    await PoolsMenu();
    await MainMenu();
  } else if (choice === 'Change Chain') {
    const { chain } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chain',
        message: 'Select Chain:',
        choices: ['firebase', 'sepolia'],
      },
    ]);
    ServiceProvider.setChain(chain);
    await MainMenu();
  } else if (choice === 'Initialize Wallet') {
    const { privateKey, password } = await inquirer.prompt([
      {
        type: 'input',
        name: 'privateKey',
        message: 'Enter your private key:',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Set a password for your wallet:',
      }
    ]);

    const success = await authManager.setWallet(privateKey, password);
    if (!success) {
      console.log('An error occurred while creating the wallet. Please check your private key.');
    }
    await MainMenu();
  } else if (choice === 'Disconnect') {
    authManager.disconnect();
    await MainMenu();
  }
}

export default MainMenu;
