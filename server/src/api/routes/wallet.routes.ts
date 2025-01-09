import { Router, Request, Response } from 'express';
import { WalletManager } from '../../managers/wallet_manager';
import { Wallet } from '../../types/types';

const router = Router();
const walletManager = new WalletManager();

/**
 * @openapi
 * /wallets:
 *   get:
 *     summary: Tüm cüzdanları getir
 *     description: Veritabanındaki tüm cüzdanları getirir.
 *     responses:
 *       200:
 *         description: Cüzdanlar başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   public_key:
 *                     type: string
 *                   balance:
 *                     type: number
 *       500:
 *         description: Cüzdanlar getirilirken sunucu hatası.
 */

/*
router.get('/', async (req, res) => {
    try {
        const wallets = await walletManager.getWallets();
        res.json(wallets);
    } catch (error) {
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Cüzdanlar getirilirken bir hata oluştu' 
        });
    }
});*/

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

/**
 * @openapi
 * /wallets:
 *   post:
 *     summary: Yeni cüzdan oluştur
 *     description: Yeni bir cüzdan oluşturur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public_key:
 *                 type: string
 *                 description: Kullanıcının public key'i.
 *     responses:
 *       201:
 *         description: Cüzdan başarıyla oluşturuldu.
 *       400:
 *         description: Public key gerekli.
 *       500:
 *         description: Cüzdan oluşturulurken sunucu hatası.
 */

/*
router.post('/', async (req: Request, res: Response) => {
    try {
        const walletData: Wallet = req.body;
        if (!walletData.public_key) {
            return res.status(400).json({ error: 'Public key gerekli' });
        }
        
        const result = await walletManager.addWallet(walletData);
        if (result) {
            res.status(201).json({ success: true, message: 'Cüzdan başarıyla oluşturuldu' });
        } else {
            res.status(500).json({ error: 'Cüzdan oluşturulamadı' });
        }
    } catch (error) {
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Cüzdan oluşturulurken bir hata oluştu' 
        });
    }
});
*/
export default router;
