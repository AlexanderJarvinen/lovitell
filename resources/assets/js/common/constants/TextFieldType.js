export const login = {
    type: 'text',
    pattern: /^[a-zA-Z0-9]+$/,
    error: 'Допускаются только символы латинского алфавита и цифры'
};

export const password = {
    type: 'password',
};

export const textarea = {
    type: 'textarea',
};