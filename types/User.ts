
export interface User {
    credentials?: Credentials,
    token?: string
    institutions?: string[]
    role: string
}

export interface Credentials {
    email: string,
    password: string
}

export interface RegisterData {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
  }
