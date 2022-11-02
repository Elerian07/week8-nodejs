import joi from 'joi';


export const createSchema = {
    body: joi.object().required().keys({
        title: joi.string().min(5).max(20).required(),
        content: joi.string().required()
    })
}


export const updateSchema = {
    body: joi.object().required().keys({
        title: joi.string().min(5).max(20).required(),
        content: joi.string().required()
    }),

    params: joi.object().required().keys({
        id: joi.string().required()
    })
}

export const deleteSchema = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}


export const noteIdSchema = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}

export const searchSchema = {
    query: joi.object().required().keys({
        search: joi.string().required()
    })
}

export const userNotesSchema = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}