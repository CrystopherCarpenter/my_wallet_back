import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import dataSchema from '../schemas/dataSchema.js';
import validateToken from '../middleware/validateToken.js';
import { getData, createData } from '../controllers/recordController.js';

const dataRouter = Router();

dataRouter.get('/mywallet', validateToken, getData);
dataRouter.post(
    '/mywallet',
    validateToken,
    validateSchema(dataSchema),
    createData
);

export default dataRouter;
