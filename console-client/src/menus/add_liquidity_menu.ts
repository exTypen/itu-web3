import inquirer from 'inquirer';
import authManager from '../managers/auth_manager';
import { SignatureUtils } from '../utils/signature_utils';
import ServiceProvider from '../providers/service_provider';

async function AddLiquidityMenu(pool_id: string): Promise<void> {
  const poolService = ServiceProvider.getPoolService();
  const transactionService = ServiceProvider.getTransactionService();
  const tokenService = ServiceProvider.getTokenService();
  const pool = await poolService.getPoolById(pool_id);
  const token1 = await tokenService.getTokenByAddress(pool.token1.address);
  const token2 = await tokenService.getTokenByAddress(pool.token2.address);

  if (!pool) return;

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Add Liquidity Menu',
      choices: [
        { name: `${token1.symbol}`, value: 1 },
        { name: `${token2.symbol}`, value: 2 },
        { name: 'Return Back', value: 'Return Back' },
      ],
    },
  ]);

  if (choice === 1) {
    const { amount } = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Enter your ' + token1.symbol + ' amount:',
      },
    ]);

    let transaction = {
      from: authManager.getPublicKey(),
      to: pool_id,
      amount: parseFloat(amount),
      token: pool.token1.address,
      type: 'add_liquidity',
      timestamp: new Date().getTime().toString(),
    };
    let body = {
      transaction: transaction,
      signature: SignatureUtils.signTransaction(transaction, authManager.getPrivateKey()!),
    };
    await transactionService.addLiquidity(body);
  } else if (choice === 2) {
    const { amount } = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Enter your ' + token2.symbol + ' amount:',
      },
    ]);

    let transaction = {
      from: authManager.getPublicKey(),
      to: pool_id,
      amount: parseFloat(amount),
      token: pool.token2.address,
      type: 'add_liquidity',
      timestamp: new Date().getTime().toString(),
    };
    let body = {
      transaction: transaction,
      signature: SignatureUtils.signTransaction(transaction, authManager.getPrivateKey()!),
    };
    await transactionService.addLiquidity(body);
  }
}

export default AddLiquidityMenu;
