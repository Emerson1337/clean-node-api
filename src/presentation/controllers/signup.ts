import { HttpRequest, HttpResponse } from './protocols/http';

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		const a;
		if (!httpRequest.body.name) {
			return {
				statusCode: 400,
				body: new Error('Missing param: namea'),
			};
		}

		if (!httpRequest.body.email) {
			return {
				statusCode: 400,
				body: new Error('Missing param: email'),
			};
		}

		return {
			statusCode: 200,
			body: 'Success',
		};
	}
}
