import { IWalletService } from '../interfaces/wallet_service';
import { ethers } from 'ethers';
import { Wallet } from '../../types/types';
import dotenv from 'dotenv';
dotenv.config();

export class SepoliaWalletService implements IWalletService {
    private provider: ethers.JsonRpcProvider;

    constructor() {
        // Sepolia test ağına bağlanıyoruz
        this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    }

    async getWalletByPublicKey(publicKey: string): Promise<Wallet> {
        try {
            // ERC20 token kontratı için ABI'yi güncelliyoruz
            const tokenAbi = [
                "function balanceOf(address) view returns (uint256)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)"
            ];
            
            // Token kontrat adresleri
            const token1Address = process.env.SEPOLIA_TOKENA_ADDRESS;
            const token2Address = process.env.SEPOLIA_TOKENB_ADDRESS;
            
            // Her iki token için kontratları oluşturuyoruz
            const token1Contract = new ethers.Contract(token1Address!, tokenAbi, this.provider);
            const token2Contract = new ethers.Contract(token2Address!, tokenAbi, this.provider);
            
            // Bakiye, decimal ve symbol bilgilerini paralel olarak alıyoruz
            const [
                token1Balance, 
                token1Decimals,
                token1Symbol,
                token2Balance,
                token2Decimals,
                token2Symbol
            ] = await Promise.all([
                token1Contract.balanceOf(publicKey),
                token1Contract.decimals(),
                token1Contract.symbol(),
                token2Contract.balanceOf(publicKey),
                token2Contract.decimals(),
                token2Contract.symbol()
            ]);
            
            // Token bakiyelerini doğru decimal değerleriyle formatlayıp number'a çeviriyoruz
            const token1FormattedBalance = Number(ethers.formatUnits(token1Balance, token1Decimals));
            const token2FormattedBalance = Number(ethers.formatUnits(token2Balance, token2Decimals));

            return {
                public_key: publicKey,
                balances: {
                    [token1Symbol]: token1FormattedBalance,
                    [token2Symbol]: token2FormattedBalance
                }
            };
        } catch (error: any) {
            throw new Error(`Token bakiyeleri alınamadı: ${error.message}`);
        }
    }
}
