import {
	Encrypter,
	AddAccountModel,
	AccountModel,
	AddAccountRepository,
} from './Protocols/DbAddAccountProtocols';
import { DbAddAccount } from './DbAddAccount';

interface SutTypes {
	sut: DbAddAccount;
	encrypterStub: Encrypter;
	addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(password: string): Promise<string> {
			return new Promise((resolve) => resolve('hashed_password'));
		}
	}

	return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add(accountData: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email',
				password: 'hashed_password',
			};

			return new Promise((resolve) => resolve(fakeAccount));
		}
	}

	return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter();
	const addAccountRepositoryStub = makeAddAccountRepository();
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

	return { sut, encrypterStub, addAccountRepositoryStub };
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

	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();

		const validPassword = 'valid_password';

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: validPassword,
		};

		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

		await sut.add(accountData);

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});

	test('Should throw if addAccount throws', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		jest
			.spyOn(addAccountRepositoryStub, 'add')
			.mockReturnValueOnce(
				new Promise((resolve, reject) => reject(new Error()))
			);

		const promise = sut.add(accountData);
		await expect(promise).rejects.toThrow();
	});

	test('Should return an account on success', async () => {
		const { sut } = makeSut();

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		const account = await sut.add(accountData);

		expect(account).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});
});
