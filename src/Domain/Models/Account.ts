import { Document, WithId } from 'mongodb';

export interface AccountModel {
	id: string;
	name: string;
	email: string;
	password: string;
}
