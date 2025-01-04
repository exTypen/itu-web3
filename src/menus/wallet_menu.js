import inquirer from "inquirer";
import walletService from "../services/wallet_service.js";
import chalk from "chalk";

async function WalletMenu(publicKey) {
    const wallet = await walletService.getWalletByPublicKey(publicKey);

    Object.entries(wallet.balances).forEach(([token, amount]) => {
      console.log(
        `${chalk.blue.bold(token)}: ${chalk.yellow.bold(amount.toFixed(6))}`
      );
    });

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Wallet Menu",
        choices: [{ name: "Return Back" }]
      }
    ]);

    if(choice === "Return Back"){}
}

export default WalletMenu;