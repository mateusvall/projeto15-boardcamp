import connection from "../src/db";

export async function getCustomers(req, res){

    const { cpf } = req.query;

    try{
       
        if(cpf){
            const customers = await connection.query("SELECT * FROM customers WHERE cpf LIKE '$1%' ", [cpf]);
            res.send(customers)
        } else{
            const customers = await connection.query("SELECT * FROM customers");
            res.send(customers)
        }

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  
}