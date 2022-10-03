import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import categoriesRouter from "../routes/categories.router.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(categoriesRouter);
app.get('/status', (req, res) => {
    const { name } = req.query;
    console.log(name);
    res.sendStatus(200);
});

app.listen(4000, () => console.log(`Magic is happening at port ${process.env.PORT}`)) 