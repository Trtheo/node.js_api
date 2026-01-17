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
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;