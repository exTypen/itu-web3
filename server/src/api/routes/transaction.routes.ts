import { Router } from 'express';
import { TransactionManager } from '../../managers/transaction_manager';

const router = Router();
const transactionManager = new TransactionManager();

/**
 * @openapi
 * /transactions/getall:
 *   get:
 *     summary: Tüm işlemleri getir
 *     description: Tüm işlemleri getirir.
 *     responses:
 *       200:
 *         description: Tüm işlemler başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/getall', async (req, res) => {
    try {
        const transactions = await transactionManager.getTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Transactions fetch failed' });
    }
});

/**
 * @openapi
 * /transactions/create:
 *   post:
 *     summary: Yeni işlem oluştur
 *     description: Yeni işlem oluşturur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 */
router.post('/create', async (req, res) => {
    try {
        const result = await transactionManager.createTransaction(req.body.transaction, req.body.signature);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({
            message: error.message || "Beklenmeyen bir hata oluştu"
        });
    }
});

//for testing
/**
 * @openapi
 * /transactions/sign:
 *   post:
 *     summary: İşlemi imzala
 *     description: İşlemi imzala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 */
router.post('/sign', async (req, res) => {
    try {
        const result = await transactionManager.signTransaction(req.body.transaction, req.body.privateKey);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({
            message: error.message || "Beklenmeyen bir hata oluştu"
        });
    }
});

export default router;
