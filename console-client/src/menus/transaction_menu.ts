import ServiceProvider from '../providers/service_provider';
import chalk from 'chalk';

async function TransactionMenu(hash: string): Promise<void> {
  const transactionService = ServiceProvider.getTransactionService();
  const transaction = await transactionService.getTransactionByHash(hash);
  if (hash) {
    console.log('------------------------------------------------');
    console.log('\nTransaction Info:');
    console.log('Hash:', chalk.yellow(hash));
    console.log('From:', chalk.yellow(transaction.from));
    console.log('To:', chalk.yellow(transaction.to));
    console.log('Amount:', chalk.yellow(transaction.amount));
    console.log('Token:', chalk.yellow(transaction.token));
    console.log('Type:', chalk.yellow(transaction.type));
    console.log('Timestamp:', chalk.yellow(transaction.timestamp));
    console.log('------------------------------------------------');
  }
}

export default TransactionMenu;
