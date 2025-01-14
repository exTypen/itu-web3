import { ethers } from 'ethers';
import AuthManager from '../../../managers/auth_manager';
import { ITransactionService } from '../../interfaces/transaction_service';
import { Transaction } from '../../../types/types';
import dotenv from 'dotenv';
dotenv.config();

const POOL_ABI = [
    "function addLiquidity(uint256 amountA, uint256 amountB) external returns (bool)",
    "function swap(address inputToken, uint256 inputAmount) external",
    "function tokenA() view returns (address)",
    "function tokenB() view returns (address)",
    "function getReserves() external view returns (uint256, uint256)"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)"
];

export class SepoliaTransactionService implements ITransactionService {
    private provider: ethers.Provider;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    }

    private getSigner(): ethers.Wallet {
        const privateKey = AuthManager.getPrivateKey();
        if (!privateKey) {
            throw new Error("Private key bulunamadı");
        }

        const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        if (formattedPrivateKey.length !== 66) {
            throw new Error("Geçersiz private key uzunluğu");
        }

        return new ethers.Wallet(formattedPrivateKey, this.provider);
    }

    private getPoolContract(): ethers.Contract {
        const signer = this.getSigner();
        return new ethers.Contract(process.env.SEPOLIA_POOL_ADDRESS!, POOL_ABI, signer);
    }

    private async approveToken(tokenAddress: string, amount: bigint): Promise<void> {
        try {
            const signer = this.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
            
            console.log(`Approving ${amount.toString()} tokens at address ${tokenAddress}`);
            const tx = await tokenContract.approve(process.env.SEPOLIA_POOL_ADDRESS!, amount, {
                gasLimit: 100000 // Gas limitini manuel olarak ayarla
            });
            
            console.log('Approval transaction hash:', tx.hash);
            await tx.wait();
            console.log('Approval confirmed');
        } catch (error: any) {
            console.error('Approval error:', error);
            throw new Error(`Token onayı başarısız: ${error.message}`);
        }
    }

    async getAllTransactions(): Promise<Transaction[]> {
        return [];
    }

    async getTransactionByHash(hash: string): Promise<Transaction> {
        const tx = await this.provider.getTransaction(hash);
        if (!tx) throw new Error("İşlem bulunamadı");
        
        return {
            id: tx.hash,
            from: tx.from,
            to: tx.to || '',
            amount: Number(tx.value),
            timestamp: new Date().toISOString(),
            token: tx.to || '',
            type: 'transfer',
        };
    }

    async addLiquidity(body: any): Promise<boolean> {
        try {
            
            const poolContract = this.getPoolContract();
            
            const [tokenA, tokenB] = await Promise.all([
                poolContract.tokenA(),
                poolContract.tokenB()
            ]);

            // Rezervleri al
            const [reserveA, reserveB] = await poolContract.getReserves();

            const sendedAmount = body.transaction.amount;
            const sendedToken = body.transaction.token;

            let amountA: bigint, amountB: bigint;

            // Kullanıcının gönderdiği token'a göre diğer token miktarını hesapla
            if(sendedToken === tokenA) {
                amountA = ethers.parseUnits(sendedAmount.toString(), 6); // USDT için 6 decimal
                // Havuz oranını koru: amountA * reserveB = amountB * reserveA
                amountB = (amountA * reserveB) / reserveA;
            } else if(sendedToken === tokenB) {
                amountB = ethers.parseUnits(sendedAmount.toString(), 18); // ARI için 18 decimal
                // Havuz oranını koru: amountA * reserveB = amountB * reserveA
                amountA = (amountB * reserveA) / reserveB;
            } else {
                throw new Error("Geçersiz token adresi");
            }

            await this.approveToken(tokenA, amountA);
            await this.approveToken(tokenB, amountB);

            // Likidite ekle
            const tx = await poolContract.addLiquidity(
                amountA,
                amountB
            );

            await tx.wait();
            return true;
        } catch (error: any) {
            console.error('Detailed error:', error);
            throw new Error(`Likidite ekleme işlemi başarısız: ${error.message}`);
        }
    }

    async swap(body: any): Promise<boolean> {
        try {
            const inputTokenAddress = body.transaction.token;
            const inputAmount = body.transaction.amount;
            const poolContract = this.getPoolContract();
            
            const tokenA = await poolContract.tokenA();
            
            const decimals = inputTokenAddress === tokenA ? 6 : 18;
            const amountBig = ethers.parseUnits(inputAmount.toString(), decimals);
            
            await this.approveToken(inputTokenAddress, amountBig);

            const tx = await poolContract.swap(
                inputTokenAddress,
                amountBig
            );

            await tx.wait();
            return true;
        } catch (error: any) {
            throw new Error(`Swap işlemi başarısız: ${error.message}`);
        }
    }
}
