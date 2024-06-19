import express from 'express';
import router from './routes/index';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	}
);

export default app;
