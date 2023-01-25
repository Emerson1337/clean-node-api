import request from 'supertest';
import { MongoHelper } from '../../../Infra/Db/Helpers/MongoHelper';
import app from '../../Config/App';
import env from '../env';

describe('SingUp Routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(env.mongoUrl);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		const accountCollection = await MongoHelper.getCollection('account');
		await accountCollection.deleteMany({});
	});

	test('Should return an account on success', async () => {
		await request(app)
			.post('/api/signup')
			.send({
				name: 'Emerson',
				email: 'emerson@gmail.com',
				password: 'root',
				passwordConfirmation: 'root',
			})
			.expect(200);
	});
});
