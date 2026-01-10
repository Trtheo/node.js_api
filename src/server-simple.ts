import 'dotenv/config';
import app from './app-simple';

const PORT = process.env.PORT || 3060;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});