import connection from "../src/db.js";
import { gameSchema } from "../schemas/schemas.js";

export async function getGames(req, res){

    const { name } = req.query;

    try{
        if(name){
            const games = await connection.query("SELECT * FROM games WHERE name LIKE '$1%' ",[name]);
            return res.send(games.rows);
        } else {
            const games = await connection.query("SELECT * FROM games");
            return res.send(games.rows);
        }
        

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  
}

export async function postGames(req, res){

    const newGame = req.body;

    try{
        const validation = gameSchema.validate(newGame);

        if (validation.error) {
            return res
                .status(400)
                .send(validation.error.details.map(detail => detail.message));
        }

        const categoryExists = await connection.query("SELECT * FROM categories WHERE id=$1",[newGame.categoryId]);

        if(!categoryExists.rows.length){
            return res.sendStatus(400);
        }

        const nameExists = await connection.query("SELECT * FROM games WHERE name=$1",[newGame.name]);

        if (nameExists.rows.length){
            return res.sendStatus(409);
        } else {
            await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5)',[newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]);
            return res.sendStatus(201);
        }

        

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }

    


}