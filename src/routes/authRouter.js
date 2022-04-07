import { Router } from 'express';
import { signin, logout, authToken } from '../controllers/authController.js';
import validateSchema from '../middleware/validateSchema.js';
import validateToken from '../middleware/validateToken.js';
import signinSchema from '../schemas/signinSchema.js';

const authRouter = Router();

authRouter.post('/', validateSchema(signinSchema), signin);
authRouter.delete('/logout', validateToken, logout);
authRouter.get('/auth-token', validateToken, authToken);

export default authRouter;
