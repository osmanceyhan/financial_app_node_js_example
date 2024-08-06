import express from 'express';
import errorHandler from './middleware/errorHandler';
import routes from "./utils/routes";
import connectDB from "./config/database";
const expenseRoutes = require('./routes/expense').default;
const authRoutes = require('./routes/auth').default;

const app = express();

// Middleware'leri ve diğer yapılandırmaları buraya ekleyin
app.use(express.json());

// Database
require('./config/database');
connectDB();

// Hata yakalama middleware'i
app.use(errorHandler);
// Route'ları tanımlayın
app.use('/api', routes);

// Sunucuyu başlatın
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
