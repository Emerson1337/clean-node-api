import { AddAccountRepository } from '../../../../Data/Protocols/AddAccountRepository';
import { AccountModel } from '../../../../Domain/Models';
import { AddAccountModel } from '../../../../Domain/UseCases';
import { MongoHelper } from '../../Helpers/MongoHelper';

export class AccountMongoRepository implements AddAccountRepository {
	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const accountCollection = MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne(accountData);
		const accountMongo = (await accountCollection.findOne(
			result.insertedId
		)) as any;

		return MongoHelper.map(accountMongo);
	}
}
