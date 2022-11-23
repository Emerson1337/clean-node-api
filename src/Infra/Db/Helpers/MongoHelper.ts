import { Collection, MongoClient } from 'mongodb';
import { AccountModel } from '../../../Domain/Models';

export const MongoHelper = {
	client: null as unknown as MongoClient,

	async connect(uri: string): Promise<void> {
		if (process.env.MONGO_URL) {
			this.client = await MongoClient.connect(process.env.MONGO_URL);
		}
	},

	async disconnect(): Promise<void> {
		await this.client.close();
	},

	getCollection(name: string): Collection {
		return this.client.db().collection(name);
	},

	map(collection: any): any {
		const { _id, ...accountWithoutId } = collection;
		return Object.assign({}, accountWithoutId, { id: _id });
	},
};
