import inquirer from "inquirer";
import { PoolService } from "../services/pool_service";
import authManager from "../managers/auth_manager";
import { TransactionService } from "../services/transaction_service";

async function AddLiquidityMenu(pool_id: string): Promise<void> {
  const poolService = new PoolService();
  const transactionService = new TransactionService();

  const pool = await poolService.getPoolById(pool_id);
  
  if (!pool) return;
  
  const { choice } = await inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "Add Liquidity Menu",
    choices: [
      {name: Object.keys(pool.token_1)[0], value: 1}, 
      {name: Object.keys(pool.token_2)[0], value: 2}, 
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
      await transactionService.addLiquidity(
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
      await transactionService.addLiquidity(
        privateKey, 
        pool_id, 
        Object.keys(pool.token_2)[0], 
        parseFloat(amount)
      );
    }
  }
}

export default AddLiquidityMenu; 