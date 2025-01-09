import { PoolService } from '../services/pool_service';
import { Pool } from '../types/types';

export class PoolManager {
  private poolService = new PoolService();
  async getPools() {
    return await this.poolService.getPools();
  }

  async getPoolByAddress(address: string) {
    return await this.poolService.getPoolByAddress(address);
  }

  async updatePool(pool: Pool, poolAddress: string) {
    return await this.poolService.updatePool(pool, poolAddress);
  }
}
