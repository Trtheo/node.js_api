import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3060;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shopdb:Password123@cluster0.5zyjafa.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Database connection error:', err));