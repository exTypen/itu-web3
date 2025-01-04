import inquirer from "inquirer";
import poolService from "../services/pool_service.js";
import PoolMenu from "./pool_menu.js";
import AuthManager from "../managers/auth_manager.js";

async function PoolsMenu(): Promise<void> {
  const pools = await poolService.getPools();

  const poolsChoices = pools.map((pool) => ({
    name: `${Object.keys(pool.token_1)[0]} / ${Object.keys(pool.token_2)[0]}`,
    value: pool.id,
  }));
  
  const { choice } = await inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "Pools Menu",
    choices: [...poolsChoices, {name: "Return Back", value: "Return Back"}]
  }]);
  
  if (pools.some((pool) => pool.id === choice)) {
    await PoolMenu(choice);
    await PoolsMenu();
  } else if(choice === "Return Back") {}
}

export default PoolsMenu; 