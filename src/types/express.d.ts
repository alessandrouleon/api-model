// src/types/express.d.ts
declare namespace Express {
    export interface Request {
        user?: {
            username: string;
            userId: string;
            roles: string[];
        };
    }
}