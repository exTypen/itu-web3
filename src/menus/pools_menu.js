import inquirer from "inquirer";
import poolService from "../services/pool_service.js";
import PoolMenu from "./pool_menu.js";

async function PoolsMenu() {
    const pools = await poolService.getPools();

    const poolsChoices = pools.map((pool) => ({
      name: `${Object.keys(pool.token_1)[0]} / ${Object.keys(pool.token_2)[0]}`, // tokenA / tokenB formatında
      value: pool.id, // Seçim değeri olarak pool id'si
    }));
    
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Pools Menu",
        choices: [...poolsChoices, "Return Back"]
      }
    ]);
    
    if (pools.some((pool) => pool.id === choice)) {
      await PoolMenu(choice);
      await PoolsMenu();
    } else if(choice === "Return Back"){}
}

export default PoolsMenu;