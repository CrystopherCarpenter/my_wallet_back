import { Router } from 'express';
import { createUser } from '../controllers/userController.js';
import validateSchema from '../middleware/validateSchema.js';
import userSchema from '../schemas/userSchema.js';

const userRouter = Router();

userRouter.post('/user', validateSchema(userSchema), createUser);

export default userRouter;
