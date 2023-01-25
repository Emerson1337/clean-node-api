import request from 'supertest';
import app from '../Config/App';

describe('CORS Middleware', () => {
	test('Should enable cors', async () => {
		app.post('/test_cors', (req, res) => {
			res.send();
		});

		await request(app)
			.post('/test_cors')
			.expect('access-control-allow-origin', '*')
			.expect('access-control-allow-methods', '*')
			.expect('access-control-allow-headers', '*');
	});
});
