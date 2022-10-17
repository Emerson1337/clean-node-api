import { EmailValidator } from '../Presentation/Protocols/EmailValidator';

export class EmailValidatorAdapater implements EmailValidator {
	isValid(email: string): boolean {
		return false;
	}
}
