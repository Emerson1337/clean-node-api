import request from 'supertest';
import { MongoHelper } from '../../../Infra/Db/Helpers/MongoHelper';
import app from '../../Config/App';

describe('SingUp Routes', () => {
	beforeAll(async () => {
		process.env.MONGO_URL && (await MongoHelper.connect(process.env.MONGO_URL));
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection('account');
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
