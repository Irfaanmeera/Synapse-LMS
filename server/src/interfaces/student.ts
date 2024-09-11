export interface IStudent {
    id?:string;
    name?: string;
    email?: string;
    mobile?: number;
    password?: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
    courses?: string[];
}
