import express from 'express';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schoolRoutes.js';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/api', schoolRoutes);

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
})
