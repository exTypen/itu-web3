import { fetchDocs, fetchDocByQuery, updateDocument } from "../utils/firebase_helper.js";

async function getPools() {
  return await fetchDocs("pools");
}

async function getPoolById(poolId) {
  return await fetchDocByQuery("pools", "id", poolId);
}

async function updatePool(pool) {
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
