import inquirer from 'inquirer';
import authManager from '../managers/auth_manager';
import ItuScanMenu from './ituscan_menu';
import WalletMenu from './wallet_menu';
import PoolsMenu from './pools_menu';

async function MainMenu(): Promise<void> {
  if (!authManager.isLoggedIn() && authManager.hasStoredWallet()) {
    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Cüzdanınızı açmak için şifrenizi girin:',
      },
    ]);

    const success = await authManager.loadWallet(password);
    if (!success) {
      console.log('Hatalı şifre veya bozuk veri!');
    }
  }

  if (authManager.isLoggedIn()) {
    console.log('\nBağlı Cüzdan: ' + authManager.getPublicKey());
  } else {
    console.log('Cüzdan bağlı değil');
  }

  console.log(
    '----------------------------------------------------------------------------------------'
  );

  const choices: any[] = [
    { name: 'My Balances', disabled: !authManager.isLoggedIn() },
    { name: 'ITUScan' },
    { name: 'Pools' },
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
  } else if (choice === 'Initialize Wallet') {
    const { privateKey, password } = await inquirer.prompt([
      {
        type: 'input',
        name: 'privateKey',
        message: 'Private key\'inizi girin:',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Cüzdanınız için bir şifre belirleyin:',
      }
    ]);

    const success = await authManager.setWallet(privateKey, password);
    if (!success) {
      console.log('Cüzdan oluşturulurken bir hata oluştu. Lütfen private key\'i kontrol edin.');
    }
    await MainMenu();
  } else if (choice === 'Disconnect') {
    authManager.disconnect();
    await MainMenu();
  }
}

export default MainMenu;
