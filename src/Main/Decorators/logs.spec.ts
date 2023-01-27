import { LogErrorRepository } from '../../Data/Protocols';
import { AccountModel } from '../../Domain/Models';
import { ok, serverError } from '../../Presentation/Helpers';
import { HttpRequest, HttpResponse } from '../../Presentation/Protocols/Http';
import { Controller } from './../../Presentation/Protocols/Controller';
import { LogControllerDecorator } from './logs';

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any_email@mail.com',
		name: 'any_name',
		password: 'any_password',
		passwordConfirmation: 'any_password',
	},
});

const makeFakeAccount = (): AccountModel => ({
	id: 'valid_id',
	email: 'valid_email@mail.com',
	name: 'valid_name',
	password: 'valid_password',
});

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = 'any_stack';

	return serverError(fakeError);
};

const makeSut = (): SutTypes => {
	const controllerStub = makeController();
	const logErrorRepositoryStub = makeLogErrorRepository();
	const sut = new LogControllerDecorator(
		controllerStub,
		logErrorRepositoryStub
	);

	return { sut, controllerStub, logErrorRepositoryStub };
};

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			return new Promise((resolve) => resolve(ok(makeFakeAccount())));
		}
	}

	return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async log(stack: string): Promise<void> {
			return new Promise((resolve) => resolve());
		}
	}

	return new LogErrorRepositoryStub();
};

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = jest.spyOn(controllerStub, 'handle');

		const httpRequest = makeFakeRequest();

		await sut.handle(httpRequest);

		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpRequest = makeFakeRequest();
		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse).toEqual(ok(makeFakeAccount()));
	});

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

		jest
			.spyOn(controllerStub, 'handle')
			.mockReturnValueOnce(
				new Promise((resolve) => resolve(makeFakeServerError()))
			);

		const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

		const httpRequest = makeFakeRequest();

		await sut.handle(httpRequest);

		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
