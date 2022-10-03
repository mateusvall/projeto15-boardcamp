import { rentalSchema } from "../schemas/schemas.js";
import connection from "../src/db.js";
import dayjs from "dayjs"


export async function getRentals(req, res){

    const { customerId, gameId} = req.query;

    try{
        const rentals = await connection.query(
        `
        SELECT *,customers.name AS "customerName", categories.name AS "categoryName", games.name AS "gameName", categories.id AS "catId", games.id AS "gamId", customers.id AS "cumId", rentals.id AS "rntId" FROM rentals 
        JOIN games ON rentals."gameId" = games.id
        JOIN categories ON games."categoryId" = categories.id
        JOIN customers ON rentals."customerId" = customers.id
        `
        );
       
        const rentalsFinal = rentals.rows.map((linha) => {
            return {
                id: linha.rntId,
                customerId: linha.cumId,
                gameId: linha.gamId,
                rentDate: linha.rentDate,
                daysRented: linha.daysRented,
                returnDate: linha.returnDate,
                originalPrice: linha.originalPrice,
                delayFee: linha.delayFee,
                customer:{
                    id:linha.cumId,
                    name: linha.customerName
                },
                game:{
                    id: linha.gamId,
                    name: linha.gameName,
                    categoryId: linha.catId,
                    categoryName: linha.categoryName
                }
               
            }
        })

        if(customerId){
            return res.send(rentalsFinal.filter((rental) => rental.customerId == customerId))
        }

        if(gameId){
            return res.send(rentalsFinal.filter((rental) => rental.gameId == gameId))
        }

        return res.send(rentalsFinal);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }

}

export async function postRental(req, res){

    const newRental = req.body;

    try{

        const validation = rentalSchema.validate(newRental);

        if (validation.error) {
            return res
                .status(400)
                .send(validation.error.details.map(detail => detail.message));
        }

        const customerExists = await connection.query('SELECT * FROM customers WHERE id=$1',[newRental.customerId]);

        if(!(customerExists.rows.length)){
            return res.sendStatus(400);
        }

        const gameExists = await connection.query('SELECT * FROM games WHERE id=$1',[newRental.gameId]);

        if(!(gameExists.rows.length)){
            return res.sendStatus(400)
        }


        const gameSelected = gameExists.rows[0];

        newRental.rentDate = dayjs().format('YYYY-MM-DD');
        newRental.originalPrice = newRental.daysRented * (gameSelected.pricePerDay);
        newRental.returnDate = null;
        newRental.delayFee = null;

        const selectedGameRentals = await connection.query('SELECT * FROM rentals WHERE "gameId"=$1',[gameSelected.id]);

        if(selectedGameRentals.rows.length >= gameSelected.stockTotal){
            return res.sendStatus(400);
        }


        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)', [newRental.customerId, newRental.gameId, newRental.rentDate, newRental.daysRented, newRental.returnDate, newRental.originalPrice, newRental.delayFee]);
        return res.sendStatus(201);



        

        

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }

}

export async function deleteRental(req, res){
    const { id } = req.params;

    try{

        const rental = await connection.query('SELECT * FROM rentals WHERE id=$1',[id]);
        const selectedRental = rental.rows[0];

        if(!selectedRental){
            return res.sendStatus(404);
        }

        if(!selectedRental.returnDate){
            return res.sendStatus(400);
        }

        await connection.query('DELETE FROM rentals WHERE id=$1',[id])
        return res.sendStatus(200);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }

}

export async function returnRental(req, res){
    const { id } = req.params;

    try{
        const rental = await connection.query('SELECT * FROM rentals WHERE id=$1',[id]);
        const selectedRental = rental.rows[0];

        console.log(selectedRental);

        if(!selectedRental){
            return res.sendStatus(404);
        }

        if(selectedRental.returnDate){
            return res.sendStatus(400);
        }

        const game = await connection.query('SELECT * FROM games WHERE id=$1',[selectedRental.gameId]);
        const gameSelected = game.rows[0];

        selectedRental.returnDate = dayjs().format('YYYY-MM-DD');
      
        const daysUsed = dayjs(selectedRental.returnDate).diff(dayjs(selectedRental.rentDate),'days');

        if(daysUsed > selectedRental.daysRented){
            selectedRental.delayFee = (daysUsed - selectedRental.daysRented)*gameSelected.pricePerDay;  
        } else{
            selectedRental.delayFee = 0;
        }

        await connection.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3',[selectedRental.returnDate, selectedRental.delayFee, id]);
        return res.sendStatus(200);
        
        

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}