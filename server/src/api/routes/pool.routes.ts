import { Router } from 'express';
import { PoolManager } from '../../managers/pool_manager';

const router = Router();
const poolManager = new PoolManager();

/**
 * @openapi
 * /pools:
 *   get:
 *     summary: Tüm havuzları getir
 *     description: Tüm havuzların listesini getirir.
 *     responses:
 *       200:
 *         description: Başarılı şekilde havuzlar getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   k:
 *                     type: number
 *                   token_1:
 *                     type: object
 *                     additionalProperties:
 *                       type: number
 *                   token_2:
 *                     type: object
 *                     additionalProperties:
 *                       type: number
 *       500:
 *         description: Sunucu hatası.
 */
router.get('/', async (req, res) => {
  try {
    const pools = await poolManager.getPools();
    res.json(pools);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Havuzlar getirilirken bir hata oluştu',
    });
  }
});

/**
 * @openapi
 * /pools/{address}:
 *   get:
 *     summary: Belirli bir havuzu getir
 *     description: ID'ye göre belirli bir havuzun bilgilerini getirir.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Havuzun ID'si.
 *     responses:
 *       200:
 *         description: Havuz bilgisi başarılı şekilde getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 k:
 *                   type: number
 *                 token_1:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                 token_2:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       404:
 *         description: Havuz bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
router.get('/:address', async (req, res) => {
  try {
    const pool = await poolManager.getPoolByAddress(req.params.address);
    if (!pool) {
      return res.status(404).json({ error: 'Havuz bulunamadı' });
    }
    res.json(pool);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Havuz getirilirken bir hata oluştu',
    });
  }
});

export default router;
