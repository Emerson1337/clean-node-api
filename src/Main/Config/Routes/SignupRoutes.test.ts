import request from 'supertest';
import app from '../../Config/App';

describe('SingUp Routes', () => {
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
