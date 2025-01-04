import walletService from "../services/wallet_service.js";
import chalk from "chalk";

async function WalletMenu(publicKey: string): Promise<void> {
  const wallet = await walletService.getWalletByPublicKey(publicKey);
  
  if (wallet) {
    console.log("\nWallet Info:");
    console.log("Public Key:", chalk.yellow(wallet.public_key));
    console.log("\nBalances:");
    Object.entries(wallet.balances).forEach(([token, amount]) => {
      console.log(`${chalk.blue(token)}: ${chalk.yellow(amount)}`);
    });
    console.log();
  }
}

export default WalletMenu; 