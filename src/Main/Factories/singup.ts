import { AccountMongoRepository } from './../../Infra/Db/Mongodb/AccountRepository/Account';
import { BcryptAdapter } from './../../Infra/Criptography/BcryptAdapter';
import { EmailValidatorAdapter } from './../../Utils/EmailValidatorAdapter';
import { SignUpController } from './../../Presentation/Controllers/SignUp/SignUpController';
import { DbAddAccount } from '../../Data/UseCases/AddAccount/DbAddAccount';
import { Controller } from '../../Presentation/Protocols';
import { LogControllerDecorator } from '../Decorators/logs';

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const encrypter = new BcryptAdapter(salt);
	const emailValidator = new EmailValidatorAdapter();
	const accountMongoRepository = new AccountMongoRepository();
	const addAccount = new DbAddAccount(encrypter, accountMongoRepository);
	const signUpController = new SignUpController(emailValidator, addAccount);

	return new LogControllerDecorator(signUpController);
};
