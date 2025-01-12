import inquirer from 'inquirer';
import { Transaction } from '../types/types';
import ServiceProvider from '../providers/service_provider';
import TransactionMenu from './transaction_menu';
import { printHeader } from '../utils/header_utils';

async function ItuScanMenu(): Promise<void> {
  console.clear();
  printHeader();
  
  const transactionService = ServiceProvider.getTransactionService();
  const transactions = await transactionService.getAllTransactions();
  const transactionHashes = transactions.map((transaction: Transaction) => transaction.id);

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Wallets',
      choices: [...transactionHashes, 'Return Back'],
    },
  ]);

  if (transactionHashes.includes(choice)) {
    await TransactionMenu(choice);
    await ItuScanMenu();
  } else if (choice === 'Return Back') {
  }
}

export default ItuScanMenu;
