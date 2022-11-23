import express from 'express';
import setupMiddlewares from './Middlewares';

const app = express();

setupMiddlewares(app);

export default app;
