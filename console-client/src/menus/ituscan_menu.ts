import inquirer from "inquirer";
import { WalletService } from "../services/wallet_service";
import WalletMenu from "./wallet_menu";
import { Wallet } from "../types/types";
async function ItuScanMenu(): Promise<void> {
  const walletService = new WalletService();
  const wallets = await walletService.getAllWallets();
  const publicKeys = wallets.map((wallet: Wallet) => wallet.public_key);

  const { choice } = await inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "Wallets",
    choices: [...publicKeys, "Return Back"]
  }]);

  if (publicKeys.includes(choice)) {
    await WalletMenu(choice);
    await ItuScanMenu();
  } else if (choice === "Return Back") {}
}

export default ItuScanMenu; 