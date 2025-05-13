export interface IReqCreateDepartment {
    code: string;
    name: string;
    type: number;
    group?: string;
    description?: string;
}

export interface IReqUpdateDepartment {
    id: string;
    code: string;
    name: string;
    type: number;
    group?: string;
    description?: string;
    updateTime?: any;
}