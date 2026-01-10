import express from 'express';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';

const app = express();

app.use(express.json());
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

export default app;