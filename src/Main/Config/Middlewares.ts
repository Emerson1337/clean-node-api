import { bodyParser } from './../Middlewares/BodyParser';
import { Express } from 'express';

export default (app: Express): void => {
	app.use(bodyParser);
};
