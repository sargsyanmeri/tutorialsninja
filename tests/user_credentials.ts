

export interface LoginCredentials {
    email: string,
    password: string
};

export const VALID_USER_CREDENTIALS: LoginCredentials  = {
    email: 'haykbaleyan1@gmail.com',
    password: 'qazwsx1234!@#$'
};

export const INVALID_USER_CREDENTIALS: LoginCredentials = {
    email: 'unknown@gmail.com',
    password: 'qazwsx1234!@#$'
};

export const INVALID_EMAIL_CREDENTIALS: LoginCredentials = {
    email: 'haykabelyangmail.com',
    password: 'qazwsx1234!@#$'
};

export const INVALID_PASSWORD_CREDENTIALS: LoginCredentials = {
    email: 'haykbaleyan1@gmail.com',
    password: 'asdadadsa@#$we!@#$'
};