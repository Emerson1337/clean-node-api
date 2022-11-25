import { bodyParser } from './../Middlewares/BodyParser';
import { Express } from 'express';
import { cors } from '../Middlewares/Cors';
import { contentType } from '../Middlewares/ContentType';

export default (app: Express): void => {
	app.use(bodyParser);
	app.use(cors);
	app.use(contentType);
};
