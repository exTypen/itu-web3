import { Router } from 'express';
import { TransactionManager } from '../../managers/transaction_manager';

const router = Router();
const transactionManager = new TransactionManager();

/**
 * @openapi
 * /transactions/swap:
 *   post:
 *     summary: Token swap işlemi yap
 *     description: Verilen havuzda token swap işlemi yapar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *                 description: Kullanıcının özel anahtarı.
 *               poolId:
 *                 type: string
 *                 description: Havuzun ID'si.
 *               token:
 *                 type: string
 *                 description: Kullanılacak token'ın adı.
 *               amount:
 *                 type: number
 *                 description: Swap yapılacak token miktarı.
 *     responses:
 *       200:
 *         description: Swap işlemi başarıyla tamamlandı.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Eksik parametreler.
 *       500:
 *         description: Swap işlemi sırasında sunucu hatası.
 */
router.post('/swap', async (req, res) => {
    try {
        const { privateKey, poolId, token, amount } = req.body;
        
        if (!privateKey || !poolId || !token || amount === undefined) {
            return res.status(400).json({ 
                error: 'Eksik parametreler: privateKey, poolId, token ve amount gerekli' 
            });
        }

        const result = await transactionManager.swap(privateKey, poolId, token, amount);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Swap işlemi sırasında bir hata oluştu' 
        });
    }
});

/**
 * @openapi
 * /transactions/liquidity/add:
 *   post:
 *     summary: Likidite ekle
 *     description: Verilen havuza likidite ekler.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *                 description: Kullanıcının özel anahtarı.
 *               poolId:
 *                 type: string
 *                 description: Havuzun ID'si.
 *               token:
 *                 type: string
 *                 description: Eklenecek token'ın adı.
 *               amount:
 *                 type: number
 *                 description: Eklenecek token miktarı.
 *     responses:
 *       200:
 *         description: Likidite başarıyla eklendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Eksik parametreler.
 *       500:
 *         description: Likidite ekleme işlemi sırasında sunucu hatası.
 */
router.post('/liquidity/add', async (req, res) => {
    try {
        const { privateKey, poolId, token, amount } = req.body;
        
        if (!privateKey || !poolId || !token || amount === undefined) {
            return res.status(400).json({ 
                error: 'Eksik parametreler: privateKey, poolId, token ve amount gerekli' 
            });
        }

        await transactionManager.addLiquidity(privateKey, poolId, token, amount);
        res.json({ 
            success: true, 
            message: 'Likidite başarıyla eklendi'
        });
    } catch (error) {
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Likidite ekleme işlemi sırasında bir hata oluştu' 
        });
    }
});

export default router;
