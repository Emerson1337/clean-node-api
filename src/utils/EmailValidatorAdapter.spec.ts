import { EmailValidatorAdapater } from './EmailValidator';

describe('EmailValidator Adapter', () => {
	test('Should return false if validator returns false', () => {
		const sut = new EmailValidatorAdapater();
		const isValid = sut.isValid('invalid_email@mail.com');

		expect(isValid).toBe(false);
	});
});
