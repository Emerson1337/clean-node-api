import { ServerError } from './../Errors/ServerError';
import { InvalidParamError } from './../Errors/InvalidParamError';
import { MissingParamError } from '../Errors/MissingParamError';
import { badRequest } from '../Helpers/HttpHelper';
import { EmailValidator } from './Protocols/EmailValidator';
import { HttpRequest, HttpResponse } from './Protocols/Http';

export class SignUpController {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	handle(httpRequest: HttpRequest): HttpResponse {
		try {
			const requiredFields = [
				'name',
				'email',
				'password',
				'passwordConfirmation',
			];

			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field));
				}
			}

			const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

			if (!isValidEmail) {
				return badRequest(new InvalidParamError('email'));
			}

			return {
				statusCode: 200,
				body: 'Success',
			};
		} catch (error) {
			return {
				statusCode: 500,
				body: new ServerError(),
			};
		}
	}
}
