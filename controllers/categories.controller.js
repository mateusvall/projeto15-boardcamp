import connection from "../src/db.js";
import { categoriesSchema } from "../schemas/schemas.js";

export async function getCategories(req, res){

    try{
        const categories = await connection.query('SELECT * FROM categories');
        return res.send(categories.rows);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  
}

export async function postCategories(req, res){

    const newCategory = req.body;

    try{

        const validation = categoriesSchema.validate(newCategory);

        if (validation.error) {
            return res
                .status(400)
                .send(validation.error.details.map(detail => detail.message));
        }

        const categoryExists = await connection.query('SELECT * FROM categories WHERE name=$1 ',[newCategory.name]);
        if(categoryExists.rows.length){
            return res.sendStatus(409)
        } else{
            await connection.query('INSERT INTO categories (name) VALUES ($1)',[newCategory.name])
            return res.sendStatus(201)
        }



    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  


}