export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface ApiError {
    message: string;
    // You can add more fields if your backend sends them
}