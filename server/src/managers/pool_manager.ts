import { PoolService} from '../services/pool_service';

export class PoolManager {
    private poolService = new PoolService();
    async getPools() {
        return await this.poolService.getPools();
    }

    async getPoolById(poolId: string) {
        return await this.poolService.getPoolById(poolId);
    }
} 