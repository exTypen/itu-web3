import inquirer from 'inquirer';
import ServiceProvider from '../providers/service_provider';
import PoolMenu from './pool_menu';
import { printHeader } from '../utils/header_utils';

async function PoolsMenu(): Promise<void> {
  console.clear();
  printHeader();
  
  const poolService = ServiceProvider.getPoolService();
  const tokenService = ServiceProvider.getTokenService();
  const pools = await poolService.getPools();
  const poolsChoices = await Promise.all(
    pools.map(async (pool) => ({
      name: `${(await tokenService.getTokenByAddress(pool.token1.address)).name} / ${(await tokenService.getTokenByAddress(pool.token2.address)).name}`,
      value: pool.id,
    }))
  );

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Pools Menu',
      choices: [...poolsChoices, { name: 'Return Back', value: 'Return Back' }],
    },
  ]);

  if (pools.some((pool) => pool.id === choice)) {
    await PoolMenu(choice);
    await PoolsMenu();
  } else if (choice === 'Return Back') {
  }
}

export default PoolsMenu;
