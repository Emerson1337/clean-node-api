import { InvalidParamError, MissingParamError } from './../Errors';
import { badRequest, serverError } from '../Helpers';
import { HttpRequest, HttpResponse, EmailValidator } from './Protocols';
import { AddAccount } from '../../Domain/UseCases';

export class SignUpController {
	private readonly emailValidator: EmailValidator;
	private readonly addAccount: AddAccount;

	constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
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

			const { name, email, password, passwordConfirmation } = httpRequest.body;

			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'));
			}

			const isValidEmail = this.emailValidator.isValid(email);

			if (!isValidEmail) {
				return badRequest(new InvalidParamError('email'));
			}

			this.addAccount.add({ name, email, password });

			return {
				statusCode: 200,
				body: 'Success',
			};
		} catch (error) {
			return serverError();
		}
	}
}
