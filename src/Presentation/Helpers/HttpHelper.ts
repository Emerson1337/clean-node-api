import { HttpResponse } from './../Controllers/Protocols/Http';

export const badRequest = (error: Error): HttpResponse => ({
	statusCode: 400,
	body: error,
});
