import ServiceProvider from '../providers/service_provider';
import chalk from 'chalk';
import { printHeader } from '../utils/header_utils';
import inquirer from 'inquirer';

async function WalletMenu(publicKey: string): Promise<void> {
  console.clear();
  printHeader();
  
  const walletService = ServiceProvider.getWalletService();
  const wallet = await walletService.getWalletByPublicKey(publicKey);
  if (publicKey) {
    console.log('\nBalances:');
    Object.entries(wallet.balances).forEach(([token, amount]) => {
      console.log(`${chalk.blue(token)}: ${chalk.yellow(amount)}`);
    });
    console.log();
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Wallet Menu',
      choices: [
        { name: 'Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'back') {
    return;
  }
}

export default WalletMenu;
