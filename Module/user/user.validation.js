import joi from 'joi';

export const deleteSchema = {
    authorization: joi.object().required().keys({
        id: joi.object().required(),
    })
}


export const getUserSchema = {
    params: joi.object().keys({
        id: joi.string().required()
    })
}