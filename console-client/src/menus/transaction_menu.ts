import ServiceProvider from '../providers/service_provider';
import chalk from 'chalk';
import { printHeader } from '../utils/header_utils';
import inquirer from 'inquirer';
async function TransactionMenu(hash: string): Promise<void> {
  const transactionService = ServiceProvider.getTransactionService();
  const transaction = await transactionService.getTransactionByHash(hash);
  console.clear();
  printHeader();
  if (hash) {
    console.log('\nTransaction Info:');
    console.log('Hash:', chalk.yellow(hash));
    console.log('From:', chalk.yellow(transaction.from));
    console.log('To:', chalk.yellow(transaction.to));
    console.log('Amount:', chalk.yellow(transaction.amount));
    console.log('Token:', chalk.yellow(transaction.token));
    console.log('Type:', chalk.yellow(transaction.type));
    console.log('Timestamp:', chalk.yellow(transaction.timestamp));
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Transaction Menu',
      choices: ['Back'],
    },
  ]);
}

export default TransactionMenu;
