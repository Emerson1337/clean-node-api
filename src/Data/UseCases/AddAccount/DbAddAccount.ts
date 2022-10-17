import { AccountModel } from '../../../Domain/Models';
import { AddAccount, AddAccountModel } from '../../../Domain/UseCases';
import { Encrypter } from '../../Protocols';

export class DbAddAccount implements AddAccount {
	private readonly encrypter: Encrypter;
	constructor(encrypter: Encrypter) {
		this.encrypter = encrypter;
	}

	async add(account: AddAccountModel): Promise<AccountModel> {
		await this.encrypter.encrypt(account.password);

		return new Promise((resolve) =>
			resolve({
				id: 'id',
				name: 'test',
				email: 'test@mail.com',
				password: 'password',
			})
		);
	}
}
