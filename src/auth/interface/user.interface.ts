export interface User {
	id?: number;
    name: string;
    email: string;
    isActive?: boolean;
    rol?:string;
    password: string;
};