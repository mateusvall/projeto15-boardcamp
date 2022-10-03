import { customerSchema } from "../schemas/schemas.js";
import connection from "../src/db.js";

export async function getCustomers(req, res){

    const { cpf } = req.query;

    try{
       
        if(cpf){
            const customers = await connection.query("SELECT * FROM customers WHERE cpf LIKE '$1%' ", [cpf]);
            res.send(customers.rows)
        } else{
            const customers = await connection.query("SELECT * FROM customers");
            res.send(customers.rows)
        }

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  
}

export async function postCustomer(req, res){

    const newCustomer = req.body;

    try{
       
        const validation = customerSchema.validate(newCustomer);

        if (validation.error) {
            return res
                .status(400)
                .send(validation.error.details.map(detail => detail.message));
        }

        const cpfExists = await connection.query("SELECT * FROM customers WHERE cpf=$1",[newCustomer.cpf]);

        if(cpfExists.rows.length){
            res.sendStatus(409)
        }else{
            await connection.query('INSERT INTO customers ("name","phone","cpf","birthday") VALUES ($1,$2,$3,$4)',[newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday]);
            res.sendStatus(201);
        }

      

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  
}

export async function updateCustomer(req, res){

    const { id } = req.params;
    const updatedData = req.body;

    try{

        const validation = customerSchema.validate(updatedData);

        if (validation.error) {
            return res
                .status(400)
                .send(validation.error.details.map(detail => detail.message));
        }

        const cpfExists = await connection.query("SELECT * FROM customers WHERE cpf=$1",[updatedData.cpf]);

        if(cpfExists.rows.length){
            return res.sendStatus(409);
        }

        const idExists = await connection.query("SELECT * FROM customers WHERE id=$1",[id]);

        if(!(idExists.rows.length)){
            return res.sendStatus(404);
        } else{
            await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5',[updatedData.name, updatedData.phone, updatedData.cpf, updatedData.birthday, id]);
            return res.sendStatus(200);
        }



    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  

}