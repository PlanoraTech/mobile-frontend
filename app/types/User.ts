export interface User {
    id: number,
    credentials: Credentials
}

export interface Credentials {
    username: string,
    passowrd: string
}