import { fetchDocs, fetchDocByQuery, updateDocument, addDocument } from "../utils/firebase_helper.js";
import { Wallet } from "../types/types.js";

async function getWallets(): Promise<Wallet[]> {
  return await fetchDocs<Wallet>("wallets");
}

async function getWalletByPublicKey(publicKey: string): Promise<Wallet | null> {
  return await fetchDocByQuery<Wallet>("wallets", "public_key", publicKey);
}

async function updateWallet(wallet: Wallet): Promise<boolean> {
  return await updateDocument("wallets", wallet.id, wallet);
}

async function addWallet(wallet: Partial<Wallet>): Promise<boolean> {
  return await addDocument("wallets", wallet);
}

export default {
  getWallets,
  getWalletByPublicKey,
  updateWallet,
  addWallet
}; 