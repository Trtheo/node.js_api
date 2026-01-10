import express from 'express';
import mockCategoriesRouter from './routes/mockCategories';

const app = express();

app.use(express.json());
app.use('/api/categories', mockCategoriesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

export default app;