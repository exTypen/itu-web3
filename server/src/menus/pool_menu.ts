import inquirer from "inquirer";
import poolService from "../services/pool_service.js";
import SwapMenu from "./swap_menu.js";
import AuthManager from "../managers/auth_manager.js";
import chalk from "chalk";
import AddLiquidityMenu from "./add_liquidity_menu.js";

async function PoolMenu(pool_id: string): Promise<void> {
  const pool = await poolService.getPoolById(pool_id);

  const choices : any[] = [
    {name: "Swap", disabled: !AuthManager.isLoggedIn()}, 
    {name: "Add Liquidity", disabled: !AuthManager.isLoggedIn()}, 
    {name: "Pool Info" }, 
    {name: "Return Back", value: "Return Back"}
  ];

  const { choice } = await inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "Pool Menu",
    choices: choices
  }]);

  if (choice === "Swap") {
    await SwapMenu(pool_id);
    await PoolMenu(pool_id);
  } else if(choice === "Add Liquidity") {
    await AddLiquidityMenu(pool_id);
    await PoolMenu(pool_id);
  } else if(choice === "Pool Info") {
    const pool = await poolService.getPoolById(pool_id);
    if (pool) {
      console.log(
        `${chalk.blue.bold([Object.keys(pool.token_1)[0]])}: ${chalk.yellow.bold([Object.values(pool.token_1)[0]])}`
      );
      console.log(
        `${chalk.blue.bold([Object.keys(pool.token_2)[0]])}: ${chalk.yellow.bold([Object.values(pool.token_2)[0]])}`
      );
      console.log(
        `${chalk.blue.bold("k")}: ${chalk.yellow.bold([pool.k])}`
      );
    }
    await PoolMenu(pool_id);
  } else if(choice === "Return Back") {}
}

export default PoolMenu; 