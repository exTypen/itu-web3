import { Transaction } from "../../types/types";

export interface ITransactionService {
    getAllTransactions(): Promise<Transaction[]>
    getTransactionByHash(hash: string): Promise<Transaction>
    swap(body: any): Promise<boolean>
    addLiquidity(body: any): Promise<boolean>
}   