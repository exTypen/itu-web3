import { fetchDocs, fetchDocByQuery, updateDocument } from "../utils/firebase_helper.js";
import { Pool } from "../types/types.js";

async function getPools(): Promise<Pool[]> {
  return await fetchDocs<Pool>("pools");
}

async function getPoolById(poolId: string): Promise<Pool | null> {
  return await fetchDocByQuery<Pool>("pools", "id", poolId);
}

async function updatePool(pool: Pool): Promise<boolean> {
  try {
    return await updateDocument("pools", pool.id, pool);
  } catch (error) {
    console.error("Error updating pool:", error);
    return false;
  }
}

export default {
  getPools,
  getPoolById,
  updatePool,
}; 