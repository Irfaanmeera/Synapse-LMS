import { IModule } from "./module";

export enum CourseApproval {
    pending = "Pending",
    rejected = "Rejected",
    approved = "Approved",
}

export interface ICourse {
    id?: string;
    name?: string;
    description?: string;
    instructor?: string;
    image?: string;
    price?: number;
    level?: string;
    enrolled?: number;
    category?: string;
    modules?: { module: string | IModule; order: number }[];
    createdAt?: Date;
    status?: boolean;
    approval?: CourseApproval;
}