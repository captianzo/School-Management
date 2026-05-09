import express from 'express';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schoolRoutes.js';
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use('/api', schoolRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
})
