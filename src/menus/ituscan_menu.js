import inquirer from "inquirer";
import WalletMenu from "./wallet_menu.js";
import walletService from "../services/wallet_service.js";

async function ituScanMenu() {
    const wallets = await walletService.getWallets();
    const publicKeys = wallets.map((wallet) => wallet.public_key);

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Wallets",
        choices: [...publicKeys, "Return Back"]
      }
    ]);
  
    if (publicKeys.includes(choice)) {
      await WalletMenu(choice);
      await ItuScanMenu();
    } else if (choice === "Return Back") {}
}

export default ituScanMenu;