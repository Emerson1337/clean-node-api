import express from 'express';
import setupMiddlewares from './Middlewares';
import setupRoutes from './Routes';

const app = express();

setupMiddlewares(app);
setupRoutes(app);

export default app;
