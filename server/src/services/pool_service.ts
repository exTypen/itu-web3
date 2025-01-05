import { FirebaseHelper } from "../utils/firebase_helper";
import { Pool } from "../types/types";

export class PoolService {
  private firebaseHelper = new FirebaseHelper();
  async getPools(): Promise<Pool[]> {
    return await this.firebaseHelper.fetchDocs<Pool>("pools");
  }

  async getPoolById(poolId: string): Promise<Pool | null> {
    return await this.firebaseHelper.fetchDocByQuery<Pool>("pools", "id", poolId);
  }

  async updatePool(pool: Pool): Promise<boolean> {
    try {
      return await this.firebaseHelper.updateDocument("pools", pool.id, pool);
    } catch (error) {
      console.error("Error updating pool:", error);
      return false;
    }
  }
}
