import { Pool } from "../../types/types";

export interface IPoolService {
    getPools(): Promise<Pool[]>
    getPoolById(poolId: string): Promise<Pool>
}