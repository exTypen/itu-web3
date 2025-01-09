import inquirer from 'inquirer';
import { PoolService } from '../services/pool_service';
import { TokenService } from '../services/token_service';
import PoolMenu from './pool_menu';

async function PoolsMenu(): Promise<void> {
  const poolService = new PoolService();
  const tokenService = new TokenService();
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
