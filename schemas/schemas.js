import joi from "joi";
import JoiDate from "@joi/date"

const Joi = joi.extend(JoiDate);

export const categoriesSchema = joi.object({
    name: joi.string().required()
})

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().min(1).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().min(1).required()
})

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    cpf: Joi.string().required(),
    birthday: Joi.date().format('YYYY-MM-DD').required()
})