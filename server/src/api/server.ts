import express from 'express';
import cors from 'cors';
import poolRoutes from './routes/pool.routes';
import walletRoutes from './routes/wallet.routes';
import transactionRoutes from './routes/transaction.routes';
import tokenRoutes from './routes/token.routes';
import { swaggerSpec, swaggerUi } from './swagger_options';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/pools', poolRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tokens', tokenRoutes);

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
