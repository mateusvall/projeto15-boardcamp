import { Router } from "express";
import { deleteRental, getRentals, postRental, returnRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', postRental);
rentalsRouter.delete('/rentals/:id', deleteRental);
rentalsRouter.post('/rentals/:id/return', returnRental)

export default rentalsRouter;