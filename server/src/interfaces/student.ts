export interface IStudent {
    id?:string|undefined;
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

export interface IUserAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: IStudent;
        userId?: string;
        token?: string;
        refreshToken?: string;
    };
}