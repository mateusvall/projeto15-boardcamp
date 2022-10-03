import { Router } from "express";

const customersRouter = Router();

customersRouter.get('/customers')
customersRouter.post('/customers')

export default customersRouter;