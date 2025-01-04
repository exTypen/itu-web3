import inquirer from "inquirer";
import AuthManager from "../managers/auth_manager.js";
import ItuScanMenu from "./ituscan_menu.js";
import WalletMenu from "./wallet_menu.js";
import PoolsMenu from "./pools_menu.js";

async function MainMenu() {
  if (AuthManager.isLoggedIn()) {
    console.log("\nConnected Wallet: " + AuthManager.getCurrentWallet());
  }else{
    console.log("Wallet not connected")
  }
  
  console.log("----------------------------------------------------------------------------------------");
  
  const choices = [{ name: "My Balances", disabled: !AuthManager.isLoggedIn()}, "ITUScan", "Pools"];

  AuthManager.isLoggedIn() ? choices.push("Disconnect") : choices.push("Initialize Wallet");

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Main Menu",
      choices: choices
    }
  ]);

  if (choice === "My Balances") {
    await WalletMenu(AuthManager.getCurrentWallet());
    await MainMenu();
  }else if(choice === "ITUScan"){
    await ItuScanMenu();
    await MainMenu();
  }else if(choice === "Pools"){
    await PoolsMenu();
    await MainMenu();
  }else if (choice === "Initialize Wallet"){

    const { phraseKey } = await inquirer.prompt([
      {
        type: "input",
        name: "phraseKey",
        message: "Enter your secret phrase:",
      },
    ]);

    await AuthManager.login(phraseKey);
    await MainMenu();
  }
  else if(choice === "Disconnect"){
    AuthManager.disconnect();
    await MainMenu();
  }
}

export default MainMenu;
