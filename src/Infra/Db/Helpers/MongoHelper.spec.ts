import env from '../../../Main/Config/env';
import { MongoHelper as sut } from './MongoHelper';

describe('Mongo Helper', () => {
	beforeAll(async () => {
		await sut.connect(env.mongoUrl);
	});

	afterAll(async () => {
		await sut.disconnect();
	});

	test('Should reconnect if mongodb is down', async () => {
		let accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
		await sut.disconnect();
		accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
	});
});
