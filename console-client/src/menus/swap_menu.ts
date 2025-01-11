import inquirer from 'inquirer';
import authManager from '../managers/auth_manager';
import ServiceProvider from '../providers/service_provider';
import { SignatureUtils } from '../utils/signature_utils';
async function SwapMenu(pool_id: string): Promise<void> {
  const poolService = ServiceProvider.getPoolService();
  const tokenService = ServiceProvider.getTokenService();
  const transactionService = ServiceProvider.getTransactionService();
  const pool = await poolService.getPoolById(pool_id);

  const token1 = await tokenService.getTokenByAddress(pool.token1.address);
  const token2 = await tokenService.getTokenByAddress(pool.token2.address);

  if (!pool) return;

  const { choice } = await inquirer.prompt<{ choice: number | string }>([
    {
      type: 'list',
      name: 'choice',
      message: 'Swap Menu',
      choices: [
        { name: `${token1.symbol}->${token2.symbol}`, value: 1 },
        { name: `${token2.symbol}->${token1.symbol}`, value: 2 },
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
      type: 'swap',
      timestamp: new Date().getTime().toString(),
    };
    let body = {
      transaction: transaction,
      signature: SignatureUtils.signTransaction(transaction, authManager.getPrivateKey()!),
    };
    await transactionService.swap(body);
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
      type: 'swap',
      timestamp: new Date().getTime().toString(),
    };
    let body = {
      transaction: transaction,
      signature: SignatureUtils.signTransaction(transaction, authManager.getPrivateKey()!),
    };
    await transactionService.swap(body);
  }
}

export default SwapMenu;
