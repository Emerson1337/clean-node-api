import { Encrypter } from './DbAddAccountProtocols';
import { DbAddAccount } from './DbAddAccount';

interface SutTypes {
	sut: DbAddAccount;
	encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(password: string): Promise<string> {
			return new Promise((resolve) => resolve('hashed_password'));
		}
	}

	return new EncrypterStub();
};

const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter();
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

	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		jest
			.spyOn(encrypterStub, 'encrypt')
			.mockReturnValueOnce(
				new Promise((resolve, reject) => reject(new Error()))
			);

		const promise = sut.add(accountData);

		expect(promise).rejects.toThrow();
	});
});
