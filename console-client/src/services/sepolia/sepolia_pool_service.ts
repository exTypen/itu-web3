import { ethers } from 'ethers';
import { Pool } from '../../types/types';
import { IPoolService } from '../interfaces/pool_service';
import { formatEther, formatUnits } from 'ethers';

const POOL_ABI = [
    "function tokenA() view returns (address)",
    "function tokenB() view returns (address)",
    "function getReserves() view returns (uint256, uint256)",
];

const POOL_ADDRESS = "0x7e05617031d46D134B44b31dBB741956bDC4AcE5";

export class SepoliaPoolService implements IPoolService {
    private provider: ethers.Provider;
    
    constructor() {
        this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/ca7d292e8ee143709e66cb9f47010744');
    }

    async getPools(): Promise<Pool[]> {
        const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, this.provider);
        
        const [tokenA, tokenB] = await Promise.all([
            contract.tokenA(),
            contract.tokenB()
        ]);
        
        const [reserveA, reserveB] = await contract.getReserves();
        
        const pool: Pool = {
            id: POOL_ADDRESS,
            k: Number(formatUnits(reserveA, 6)) * Number(formatUnits(reserveB, 18)),
            token1: {
                address: tokenA,
                amount: Number(formatUnits(reserveA, 6))
            },
            token2: {
                address: tokenB,
                amount: Number(formatEther(reserveB))
            }
        };
        
        return [pool];
    }

    async getPoolById(poolId: string): Promise<Pool> {
        if (poolId.toLowerCase() !== POOL_ADDRESS.toLowerCase()) {
            throw new Error('Pool not found');
        }
        
        const pools = await this.getPools();
        return pools[0];
    }
}
