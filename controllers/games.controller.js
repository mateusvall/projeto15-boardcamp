import connection from "../src/db";
import { gameSchema } from "../schemas/schemas";

export async function getGames(req, res){

    const { name } = req.query;

    try{
        if(name){
            const games = await connection.query("SELECT * FROM games WHERE name LIKE '$1%' ",[name]).toArray();
            return res.send(games);
        } else {
            const games = await connection.query("SELECT * FROM games").toArray();
            return res.send(games);
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

        

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }

    


}