import inquirer from "inquirer";
import authManager from "../managers/auth_manager";
import ItuScanMenu from "./ituscan_menu";
import WalletMenu from "./wallet_menu";
import PoolsMenu from "./pools_menu";

async function MainMenu(): Promise<void> {
  if (authManager.isLoggedIn()) {
    console.log("\nConnected Wallet: " + authManager.getCurrentWallet());
  } else {
    console.log("Wallet not connected");
  }
  
  console.log("----------------------------------------------------------------------------------------");
  
  const choices : any[]= [
    { name: "My Balances", disabled: !authManager.isLoggedIn()}, 
    { name: "ITUScan" }, 
    { name: "Pools" }
  ];

  authManager.isLoggedIn() ? choices.push({ name: "Disconnect" }) : choices.push({ name: "Initialize Wallet" });

  const { choice } = await inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "Main Menu",
    choices: choices
  }]);

  if (choice === "My Balances") {
    const currentWallet = authManager.getCurrentWallet();
    if (currentWallet) {
      await WalletMenu(currentWallet);
    }
    await MainMenu();
  } else if(choice === "ITUScan") {
    await ItuScanMenu();
    await MainMenu();
  } else if(choice === "Pools") {
    await PoolsMenu();
    await MainMenu();
  } else if (choice === "Initialize Wallet") {
    const { phraseKey } = await inquirer.prompt([{
      type: "input",
      name: "phraseKey",
      message: "Enter your secret phrase:",
    }]);

    await authManager.login(phraseKey);
    await MainMenu();
  } else if(choice === "Disconnect") {
    authManager.disconnect();
    await MainMenu();
  }
}

export default MainMenu; 