export interface User {
    id: number,
    credentials: Credentials,
    accessToken: string
}

export interface Credentials {
    username: string,
    passowrd: string
}