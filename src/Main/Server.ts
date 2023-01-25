import { MongoHelper } from './../Infra/Db/Helpers/MongoHelper';
import env from './Config/env';

MongoHelper.connect(env.mongoUrl)
	.then(async () => {
		const app = (await import('./Config/App')).default;

		app.listen(env.port, () => {
			console.log(
				`Server has been initializated! 🚀 Running at http://localhost:${env.port}`
			);
		});
	})
	.catch(console.error);
