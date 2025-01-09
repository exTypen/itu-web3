import { Router } from 'express';
import { TokenManager } from '../../managers/token_manager';

const router = Router();
const tokenManager = new TokenManager();

/**
 * @openapi
 * /tokens/getall:
 *   get:
 *     summary: Tüm tokenleri getir
 *     description: Tüm tokenlerin listesini getirir.
 *     responses:
 *       200:
 *         description: Başarılı şekilde tokenler getirildi.
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
 */
router.get('/getall', async (req, res) => {
  const tokens = await tokenManager.getTokens();
  res.json(tokens);
});

/**
 * @openapi
 * /tokens/getbyaddress/{address}:
 *   get:
 *     summary: Belirli bir tokeni getir
 *     description: Belirli bir tokenin bilgilerini getirir.
 *     parameters:
 *       - name: address
 *         in: path
 *         required: true
 *         description: Token'ın adresi
 *     responses:
 *       200:
 *         description: Başarılı şekilde token getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
router.get('/getbyaddress/:address', async (req, res) => {
  const token = await tokenManager.getTokenByAddress(req.params.address);
  res.json(token);
});

export default router;
