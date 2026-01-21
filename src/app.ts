import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import authRouter from './routes/auth';
import ordersRouter from './routes/orders';
import reviewsRouter from './routes/reviews';
import uploadRouter from './routes/upload';
import statsRouter from './routes/stats';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Documentation'
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/stats', statsRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;