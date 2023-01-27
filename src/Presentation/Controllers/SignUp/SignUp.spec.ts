import { HttpRequest } from './../../Protocols/Http';
import { SignUpController } from './SignUpController';
import {
	MissingParamError,
	ServerError,
	InvalidParamError,
} from '../../Errors';
import {
	EmailValidator,
	AddAccount,
	AddAccountModel,
	AccountModel,
} from './Protocols/SignUpProtocols';
import { ok, badRequest, serverError } from '../../Helpers';

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any_email@mail.com',
		name: 'any_name',
		password: 'any_password',
		passwordConfirmation: 'any_password',
	},
});

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: EmailValidator;
	addAccountStub: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = makeFakeAccount();

			return new Promise((resolve) => resolve(fakeAccount));
		}
	}

	return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
	id: 'valid_id',
	email: 'valid_email@mail.com',
	name: 'valid_name',
	password: 'valid_password',
});

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();
	const sut = new SignUpController(emailValidatorStub, addAccountStub);
	return {
		sut,
		emailValidatorStub,
		addAccountStub,
	};
};

describe('SignUp controller', () => {
	test('Should return 400 if no name is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
	});

	test('Should return 400 if no email is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
	});

	test('Should return 400 if no password is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				name: 'any_name',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});

	test('Should return 400 if no password confirmation is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				name: 'any_name',
				password: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError('passwordConfirmation'))
		);
	});

	test('Should return 400 if no password confirmation fails', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(
			badRequest(new InvalidParamError('passwordConfirmation'))
		);
	});

	test('Should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
	});

	test('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

		const httpRequest = makeFakeRequest();

		await sut.handle(httpRequest);
		expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
	});

	test('Should return 500 if EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut();

		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerError()));
	});

	test('Should return 500 if AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut();

		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => reject(new Error()));
		});

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerError()));
	});

	test('Should call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, 'add');

		await sut.handle(makeFakeRequest());
		expect(addSpy).toHaveBeenCalledWith({
			email: 'any_email@mail.com',
			name: 'any_name',
			password: 'any_password',
		});
	});

	test('Should return 200 if valid data is provided', async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
	});
});
