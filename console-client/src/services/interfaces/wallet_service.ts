import { Wallet } from "../../types/types";

export interface IWalletService {
    getWalletByPublicKey(publicKey: string): Promise<Wallet>
}