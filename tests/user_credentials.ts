

export interface LoginCredentials {
    email: string,
    password: string
};

export const VALID_USER_CREDENTIALS: LoginCredentials  = {
    email: 'testerid223@gmail.com',
    password: '1122334455??M'
};

export const INVALID_USER_CREDENTIALS: LoginCredentials = {
    email: 'unknown@gmail.com',
    password: 'qazwsx1234!@#$'
};

export const INVALID_EMAIL_CREDENTIALS: LoginCredentials = {
    email: 'teierid223@gmail.com',
    password: '1122334455??M'
};

export const INVALID_PASSWORD_CREDENTIALS: LoginCredentials = {
    email: 'testerid223@gmail.com',
    password: 'asdadadsa@#$we!@#$'
};

