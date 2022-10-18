import { Encrypter } from '../../Protocols';
import { DbAddAccount } from './DbAddAccount';

interface SutTypes {
	sut: DbAddAccount;
	encrypterStub: Encrypter;
}

const makeSut = (): SutTypes => {
	class EncrypterStub {
		async encrypt(password: string): Promise<string> {
			return new Promise((resolve) => resolve('hashed_password'));
		}
	}

	const encrypterStub = new EncrypterStub();
	const sut = new DbAddAccount(encrypterStub);

	return { sut, encrypterStub };
};

describe('DbAddAccount UseCase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut();

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
