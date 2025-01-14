import inquirer from 'inquirer';
import SwapMenu from './swap_menu';
import authManager from '../managers/auth_manager';
import chalk from 'chalk';
import AddLiquidityMenu from './add_liquidity_menu';
import ServiceProvider from '../providers/service_provider';
import { printHeader } from '../utils/header_utils';
async function PoolMenu(pool_id: string): Promise<void> {
  const poolService = ServiceProvider.getPoolService();
  const tokenService = ServiceProvider.getTokenService();

  const choices: any[] = [
    { name: 'Swap', disabled: !authManager.isLoggedIn() },
    { name: 'Add Liquidity', disabled: !authManager.isLoggedIn() },
    { name: 'Pool Info' },
    { name: 'Return Back', value: 'Return Back' },
  ];

  console.clear();
  printHeader();

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Pool Menu',
      choices: choices,
    },
  ]);

  if (choice === 'Swap') {
    await SwapMenu(pool_id);
    await PoolMenu(pool_id);
  } else if (choice === 'Add Liquidity') {
    await AddLiquidityMenu(pool_id);
    await PoolMenu(pool_id);
  } else if (choice === 'Pool Info') {
    const pool = await poolService.getPoolById(pool_id);
    if (pool) {
      console.log(
        `${chalk.blue.bold((await tokenService.getTokenByAddress(pool.token1.address)).symbol)}: ${chalk.yellow.bold(pool.token1.amount)}`
      );
      console.log(
        `${chalk.blue.bold((await tokenService.getTokenByAddress(pool.token2.address)).symbol)}: ${chalk.yellow.bold(pool.token2.amount)}`
      );
      console.log(`${chalk.blue.bold('k')}: ${chalk.yellow.bold(pool.k)}`);
    }
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Pool Info',
        choices: [
          { name: 'Back', value: 'back' }
        ]
      }
    ]);
  
    if (action === 'back') {
      return;
    }
    
  } else if (choice === 'Return Back') {
  }
}

export default PoolMenu;
