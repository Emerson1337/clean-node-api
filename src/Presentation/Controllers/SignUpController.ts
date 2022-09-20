import { InvalidParamError, MissingParamError } from './../Errors';
import { badRequest, serverError } from '../Helpers';
import { HttpRequest, HttpResponse, EmailValidator } from './Protocols';

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

			if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'));
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
			return serverError();
		}
	}
}
