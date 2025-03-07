import express from 'express';
import ViteExpress from 'vite-express';
import router from './routes';

const app = express();

app.use(express.json());
app.use(router);

ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'));
