import { HttpResponse } from './../Controllers/Protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
	statusCode: 400,
	body: error,
});
