import connection from "../src/db.js";

export async function getCategories(req, res){

    try{
        const categories = await connection.query('SELECT * FROM categories').toArray();
        return res.send(categories);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  
}

export async function postCategories(req, res){
    const { name } = req.body;

    if(name === ''){
        return res.sendStatus(400);
    }

    try{
        const categoryExists = await connection.query('SELECT * FROM categories WHERE name=$1 ',[name]).toArray();
        if(categoryExists.length){
            return res.sendStatus(409)
        } else{
            await connection.query('INSERT INTO categories (name) VALUES ($1)',[name])
            return res.sendStatus(201)
        }



    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  


}