import { AccountMongoRepository } from './../../Infra/Db/Mongodb/AccountRepository/Account';
import { BcryptAdapter } from './../../Infra/Criptography/BcryptAdapter';
import { EmailValidatorAdapter } from './../../Utils/EmailValidatorAdapter';
import { SignUpController } from './../../Presentation/Controllers/SignUp/SignUpController';
import { DbAddAccount } from '../../Data/UseCases/AddAccount/DbAddAccount';

export const makeSignUpController = (): SignUpController => {
	const salt = 12;
	const encrypter = new BcryptAdapter(salt);
	const emailValidator = new EmailValidatorAdapter();
	const accountMongoRepository = new AccountMongoRepository();
	const addAccount = new DbAddAccount(encrypter, accountMongoRepository);

	return new SignUpController(emailValidator, addAccount);
};
