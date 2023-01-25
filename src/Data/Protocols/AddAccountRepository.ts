import { AccountModel } from './../../Domain/Models/Account';
import { AddAccountModel } from '../../Domain/UseCases';

export interface AddAccountRepository {
	add(accountData: AddAccountModel): Promise<AccountModel>;
}
