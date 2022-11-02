import joi from 'joi';

export const sinUpSchema = {
    body: joi.object().required().keys({
        userName: joi.string().min(4).max(15).required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        age: joi.number(),
        phone: joi.number()
    })
}

export const signInSchema = {
    body: joi.object().required().keys({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })
}

export const forgetPasswordSchema = {
    body: joi.object().required().keys({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        newPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        newCPassword: joi.string().valid(joi.ref("newPassword")).required(),
        OTP: joi.string().required()
    })
}