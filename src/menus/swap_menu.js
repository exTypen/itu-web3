import inquirer from "inquirer";
import poolService from "../services/pool_service.js";
import transactionManager from "../managers/transaction_manager.js";
import authManager from "../managers/auth_manager.js";

async function SwapMenu(pool_id) {
    const pool = await poolService.getPoolById(pool_id);
    
    
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Swap Menu",
        choices: [{name: Object.keys(pool.token_1)[0] + "->" + Object.keys(pool.token_2)[0], value: 1}, {name: Object.keys(pool.token_2)[0] + "->" + Object.keys(pool.token_1)[0], value: 2}, "Return Back"]
      }
    ]);

    if(choice === 1){

      const { amount } = await inquirer.prompt([
        {
          type: "input",
          name: "amount",
          message: "Enter your " + Object.keys(pool.token_1)[0] + " amount:",
        },
      ]);
      
      await transactionManager.swap(authManager.getPrivateKey(), pool_id, Object.keys(pool.token_1)[0], parseFloat(amount));

    }else if(choice === 2){
      
      const { amount } = await inquirer.prompt([
        {
          type: "input",
          name: "amount",
          message: "Enter your " + Object.keys(pool.token_2)[0] + " amount:",
        },
      ]);
      
      await transactionManager.swap(authManager.getPrivateKey(), pool_id, Object.keys(pool.token_2)[0], parseFloat(amount));

    }
    else if(choice === "Return Back"){}
}

export default SwapMenu;