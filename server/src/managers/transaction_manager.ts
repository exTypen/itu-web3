import walletService from "../services/wallet_service.js";
import poolService from "../services/pool_service.js";
import HashUtils from "../utils/hash_utils.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { Pool, Wallet } from "../types/types.js";

async function swap(privateKey: string, poolId: string, token: string, amount: number): Promise<{ wallet: Wallet; pool: Pool } | void> {
  try {
    const publicKey = HashUtils.sha256(privateKey);
    const wallet = await walletService.getWalletByPublicKey(publicKey);
    
    if (!wallet) {
      throw new Error("Wallet not found for the provided private key.");
    }

    const pool = await poolService.getPoolById(poolId);
    if (!pool) {
      throw new Error("Pool not found for the provided pool ID.");
    }

    const token1 = Object.keys(pool.token_1)[0];
    const token2 = Object.keys(pool.token_2)[0];
    const targetToken = token === token1 ? token2 : token1;

    const token1Amount = pool.token_1[token1];
    const token2Amount = pool.token_2[token2];
    const k = pool.k;

    if (!wallet.balances[token] || wallet.balances[token] < amount) {
      throw new Error(`Insufficient ${token} balance.`);
    }

    const updatedTokenAmount = token === token1 ? token1Amount + amount : token2Amount + amount;
    const updatedTargetTokenAmount = k / updatedTokenAmount;
    const targetTokenDelta = (token === token1 ? token2Amount : token1Amount) - updatedTargetTokenAmount;

    console.log("Transaction details: \n");
    console.log(`${chalk.blue.bold(token)}: ${chalk.yellow.bold(amount.toFixed(3))}`);
    console.log(`${chalk.blue.bold(targetToken)}: ${chalk.yellow.bold(targetTokenDelta.toFixed(3))}`);
    
    const { confirm } = await inquirer.prompt([{
      type: "list",
      name: "confirm",
      message: "Do you confirm the transaction?",
      choices: ["Yes", "No"]
    }]);

    if (confirm !== "Yes") {
      console.log("Transaction canceled.");
      return;
    }

    if (targetTokenDelta <= 0) {
      throw new Error("Swap amount is too small to provide a meaningful target token output.");
    }

    wallet.balances[token] -= amount;
    wallet.balances[targetToken] = (wallet.balances[targetToken] || 0) + targetTokenDelta;

    if (token === token1) {
      pool.token_1[token1] += amount;
      pool.token_2[token2] = updatedTargetTokenAmount;
    } else {
      pool.token_2[token2] += amount;
      pool.token_1[token1] = updatedTargetTokenAmount;
    }

    const walletUpdateResult = await walletService.updateWallet(wallet);
    const poolUpdateResult = await poolService.updatePool(pool);

    if (!walletUpdateResult || !poolUpdateResult) {
      throw new Error("Failed to update wallet or pool after swap.");
    }

    console.log(
      `Successfully swapped ${amount} ${token} for ${targetTokenDelta.toFixed(6)} ${targetToken}.`
    );
    return { wallet, pool };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during swap operation:", error.message);
    }
    throw error;
  }
}

async function addLiquidity(privateKey: string, poolId: string, token: string, amount: number): Promise<void> {
  const publicKey = HashUtils.sha256(privateKey);
  const wallet = await walletService.getWalletByPublicKey(publicKey);
  
  if (!wallet) {
    throw new Error("Wallet not found for the provided private key.");
  }

  const pool = await poolService.getPoolById(poolId);
  if (!pool) {
    throw new Error("Pool not found for the provided pool ID.");
  }

  const token1 = Object.keys(pool.token_1)[0];
  const token2 = Object.keys(pool.token_2)[0];
  const targetToken = token === token1 ? token2 : token1;

  const token1PoolAmount = pool.token_1[token1];
  const token2PoolAmount = pool.token_2[token2];
  const currentTokenRatio = token === token1 ? token2PoolAmount / token1PoolAmount : token1PoolAmount / token2PoolAmount;

  const requiredTargetTokenAmount = amount * currentTokenRatio;

  if (!wallet.balances[token] || wallet.balances[token] < amount || !wallet.balances[targetToken] || wallet.balances[targetToken] < requiredTargetTokenAmount) {
    console.log("Insufficient token balance.");
  } else {
    console.log("Transaction details: \n");
    console.log(`${chalk.blue.bold(token)}: ${chalk.yellow.bold(amount.toFixed(3))}`);
    console.log(`${chalk.blue.bold(targetToken)}: ${chalk.yellow.bold(requiredTargetTokenAmount.toFixed(3))}`);
    
    const { confirm } = await inquirer.prompt([{
      type: "list",
      name: "confirm",
      message: "Do you confirm the transaction?",
      choices: ["Yes", "No"]
    }]);

    if (confirm !== "Yes") {
      console.log("Transaction canceled.");
      return;
    }

    let newK = 0;
    if (Object.keys(pool.token_1)[0] === token) {
      pool.token_1[token] += amount;
      pool.token_2[targetToken] += requiredTargetTokenAmount;
      newK = (token1PoolAmount + amount) * (token2PoolAmount + requiredTargetTokenAmount);
    } else {
      pool.token_2[token] += amount;
      pool.token_1[targetToken] += requiredTargetTokenAmount;
      newK = (token2PoolAmount + amount) * (token1PoolAmount + requiredTargetTokenAmount);
    }
    pool.k = newK;

    await poolService.updatePool(pool);
    wallet.balances[token] = wallet.balances[token] - amount;
    wallet.balances[targetToken] = wallet.balances[targetToken] - requiredTargetTokenAmount;

    await walletService.updateWallet(wallet);
  }
  console.log(
    `Successfully added liquidity ${amount} ${token} for ${requiredTargetTokenAmount.toFixed(6)} ${targetToken}.`
  );
}

export default {
  swap,
  addLiquidity
}; 