import { HttpResponse, HttpRequest } from './../../Presentation/Protocols/Http';
import { Controller } from './../../Presentation/Protocols/Controller';
import { LogErrorRepository } from '../../Data/Protocols';

export class LogControllerDecorator implements Controller {
	private readonly controller: Controller;
	private readonly logErroRepository: LogErrorRepository;

	constructor(controller: Controller, logErroRepository: LogErrorRepository) {
		this.controller = controller;
		this.logErroRepository = logErroRepository;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const httpResponse = await this.controller.handle(httpRequest);

		if (httpResponse.statusCode === 500) {
			this.logErroRepository.log(httpResponse.body.stack);
		}

		return httpResponse;
	}
}
