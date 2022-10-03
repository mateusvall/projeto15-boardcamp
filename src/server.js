import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import categoriesRouter from "../routes/categories.router.js";
import gamesRouter from "../routes/games.router.js";
import customersRouter from "../routes/customers.router.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter)
app.get('/status', (req, res) => {
    const { name } = req.query;
    console.log(name);
    res.sendStatus(200);
});

app.listen(process.env.PORT, () => console.log(`Magic is happening at port ${process.env.PORT}`)) 