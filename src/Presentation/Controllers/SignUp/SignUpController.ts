import { InvalidParamError, MissingParamError } from '../../Errors';
import { badRequest, ok, serverError } from '../../Helpers';
import {
	HttpRequest,
	HttpResponse,
	EmailValidator,
	Controller,
	AddAccount,
} from './Protocols/SignUpProtocols';

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly addAccount: AddAccount;

	constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

			const account = await this.addAccount.add({ name, email, password });

			return ok(account);
		} catch (error) {
			return serverError(error);
		}
	}
}
