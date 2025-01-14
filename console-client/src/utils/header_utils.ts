import chalk from 'chalk';
import ServiceProvider from '../providers/service_provider';
import authManager from '../managers/auth_manager';

export function printHeader(): void {
  console.log(chalk.blue(`
██╗████████╗██╗   ██╗███████╗██╗    ██╗ █████╗ ██████╗ 
██║╚══██╔══╝██║   ██║██╔════╝██║    ██║██╔══██╗██╔══██╗
██║   ██║   ██║   ██║███████╗██║ █╗ ██║███████║██████╔╝
██║   ██║   ██║   ██║╚════██║██║███╗██║██╔══██║██╔═══╝ 
██║   ██║   ╚██████╔╝███████║╚███╔███╔╝██║  ██║██║     
╚═╝   ╚═╝    ╚═════╝ ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝     
`));

  console.log(chalk.yellow('Chain:'), chalk.green(ServiceProvider.getChain().toUpperCase()));
  
  if (authManager.isLoggedIn()) {
    console.log(chalk.yellow('Wallet:'), chalk.green(authManager.getPublicKey()));
  } else {
    console.log(chalk.yellow('Wallet:'), chalk.red('Not Connected'));
  }

  console.log(chalk.blue('─'.repeat(70)));
} 