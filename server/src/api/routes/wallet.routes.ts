import { Router, Request, Response } from 'express';
import { WalletManager } from '../../managers/wallet_manager';
import { Wallet } from '../../types/types';

const router = Router();
const walletManager = new WalletManager();

/**
 * @openapi
 * /wallets/{publicKey}:
 *   get:
 *     summary: Public key ile cüzdan getir
 *     description: Verilen public key'e sahip cüzdanı getirir.
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         description: Public key of the wallet.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cüzdan başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 public_key:
 *                   type: string
 *                 balance:
 *                   type: number
 *       404:
 *         description: Cüzdan bulunamadı.
 *       500:
 *         description: Cüzdan getirilirken sunucu hatası.
 */
router.get('/:publicKey', async (req: Request, res: Response) => {
    try {
        const wallet = await walletManager.getWalletByPublicKey(req.params.publicKey);
        if (!wallet) {
            return res.status(404).json({ error: 'Cüzdan bulunamadı' });
        }
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Cüzdan getirilirken bir hata oluştu' 
        });
    }
});

export default router;
