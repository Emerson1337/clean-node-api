import { adaptRoute } from './../../Adapters/ExpressRoutesAdapters';
import { Router } from 'express';
import { makeSignUpController } from '../../Factories/singup';

export default (router: Router): void => {
	router.post('/signup', adaptRoute(makeSignUpController()));
};
