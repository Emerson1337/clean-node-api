import request from 'supertest';
import app from '../Config/App';

describe('Content Type Middleware', () => {
	test('Should return content type as json', async () => {
		app.post('/test_content_type', (req, res) => {
			res.send();
		});

		await request(app).get('/test_content_type').expect('Content-Type', /html/);
	});
});
