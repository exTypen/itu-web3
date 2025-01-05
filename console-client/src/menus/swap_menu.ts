import inquirer from "inquirer";
import { AuthManager } from "../managers/auth_manager";
import { PoolService } from "../services/pool_service";
import { TransactionService } from "../services/transaction_service";

async function SwapMenu(pool_id: string): Promise<void> {
  const poolService = new PoolService();
  const transactionService = new TransactionService();
  const authManager = new AuthManager();
  const pool = await poolService.getPoolById(pool_id);
  
  if (!pool) return;
  
  const { choice } = await inquirer.prompt<{ choice: number | string }>([{
    type: "list",
    name: "choice",
    message: "Swap Menu",
    choices: [
      {name: Object.keys(pool.token_1)[0] + "->" + Object.keys(pool.token_2)[0], value: 1}, 
      {name: Object.keys(pool.token_2)[0] + "->" + Object.keys(pool.token_1)[0], value: 2}, 
      {name: "Return Back", value: "Return Back"}
    ]
}]);
  if(choice === 1) {
    const { amount } = await inquirer.prompt([{
      type: "input",
      name: "amount",
      message: "Enter your " + Object.keys(pool.token_1)[0] + " amount:",
    }]);
    
    const privateKey = authManager.getPrivateKey();
    if (privateKey) {
      await transactionService.swap(
        privateKey, 
        pool_id, 
        Object.keys(pool.token_1)[0], 
        parseFloat(amount)
      );
    }
  } else if(choice === 2) {
    const { amount } = await inquirer.prompt([{
      type: "input",
      name: "amount",
      message: "Enter your " + Object.keys(pool.token_2)[0] + " amount:",
    }]);
    
    const privateKey = authManager.getPrivateKey();
    if (privateKey) {
      await transactionService.swap(
        privateKey, 
        pool_id, 
        Object.keys(pool.token_2)[0], 
        parseFloat(amount)
      );
    }
  }
}

export default SwapMenu; 