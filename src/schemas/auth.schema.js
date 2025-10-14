const { z } = require('zod');

const registerSchema = z.object({
    username: z.string({
        required_error: 'Username is requires'
    }),
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid Email'
    }),

    password: z.string({
        required_error: 'Password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    }),

    role: z.enum(['admin', 'tecnico', 'facturacion'], {
        required_error: 'Rol is required',
        invalid_type_error: 'Rol must be one of admin, tecnico or facturación'
    }),
});

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    }).email({
        message: 'Email is not valid',
    }),
    password: z.string({
        required_error: 'Password is required',
    }).min(6, {
        message: 'Password must be at least 6 characters',
    }),
});

module.exports = {
    registerSchema,
    loginSchema
};
