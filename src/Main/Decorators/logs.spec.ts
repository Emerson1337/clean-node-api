import { HttpRequest, HttpResponse } from '../../Presentation/Protocols/Http';
import { Controller } from './../../Presentation/Protocols/Controller';
import { LogControllerDecorator } from './logs';

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
}

const makeSut = (): SutTypes => {
	const controllerStub = makeControlller();
	const sut = new LogControllerDecorator(controllerStub);

	return { sut, controllerStub };
};

const makeControlller = (): Controller => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				body: { ok: 'ok!' },
				statusCode: 200,
			};

			return new Promise((resolve) => resolve(httpResponse));
		}
	}

	return new ControllerStub();
};

describe('LogController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = jest.spyOn(controllerStub, 'handle');

		const httpRequest = {
			body: {
				email: 'any_mail@mail.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		await sut.handle(httpRequest);

		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});
});
