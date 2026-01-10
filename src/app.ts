import express from 'express';
import morgan from 'morgan';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

export default app;