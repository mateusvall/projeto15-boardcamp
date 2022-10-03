import { Router } from "express";
import { getCustomers, postCustomer, updateCustomer } from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.post('/customers', postCustomer);
customersRouter.put('/customers/:id', updateCustomer)

export default customersRouter;