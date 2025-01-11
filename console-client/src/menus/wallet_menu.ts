import ServiceProvider from '../providers/service_provider';
import chalk from 'chalk';

async function WalletMenu(publicKey: string): Promise<void> {
  const walletService = ServiceProvider.getWalletService();
  const wallet = await walletService.getWalletByPublicKey(publicKey);
  if (publicKey) {
    console.log('\nWallet Info:');
    console.log('Public Key:', chalk.yellow(publicKey));
    console.log('\nBalances:');
    Object.entries(wallet.balances).forEach(([token, amount]) => {
      console.log(`${chalk.blue(token)}: ${chalk.yellow(amount)}`);
    });
    console.log();
  }
}

export default WalletMenu;
