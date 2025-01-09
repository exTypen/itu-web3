import { FirebaseHelper } from "../utils/firebase_helper";
import { Pool } from "../types/types";

export class PoolService {
  private firebaseHelper = new FirebaseHelper();
  async getPools(): Promise<Pool[]> {
    return await this.firebaseHelper.fetchDocs<Pool>("pools");
  }

  async getPoolByAddress(address: string): Promise<Pool | null> {
    return await this.firebaseHelper.fetchDoc<Pool>("pools", address);
  }

  async updatePool(pool: Pool, poolAddress: string): Promise<boolean> {
    try {
      return await this.firebaseHelper.updateDocument("pools", poolAddress, pool);
    } catch (error) {
      console.error("Error updating pool:", error);
      return false;
    }
  }
}