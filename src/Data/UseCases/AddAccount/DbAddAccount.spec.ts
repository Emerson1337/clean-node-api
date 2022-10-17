import { DbAddAccount } from './DbAddAccount';

describe('DbAddAccount UseCase', () => {
	test('Should call Encrypter with correct password', async () => {
		class EncrypterStub {
			async encrypt(password: string): Promise<string> {
				return new Promise((resolve) => resolve('hashed_password'));
			}
		}

		const encrypterStub = new EncrypterStub();
		const sut = new DbAddAccount(encrypterStub);

		const validPassword = 'valid_password';

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: validPassword,
		};

		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

		await sut.add(accountData);

		expect(encryptSpy).toHaveBeenCalledWith(validPassword);
	});
});
