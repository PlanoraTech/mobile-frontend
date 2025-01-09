export interface User {
    id: number,
    credentials: Credentials,
    accessToken: string
}

export interface Credentials {
    email: string,
    password: string
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
