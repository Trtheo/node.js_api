import express from 'express';
import morgan from 'morgan';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import authRouter from './routes/auth';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;