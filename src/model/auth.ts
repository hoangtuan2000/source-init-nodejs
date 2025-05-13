export interface IReqLogin {
    userName: string;
    password: string;
}

export interface IAccountByJWT {
    roleId: string;
    accountId: string;
    userName: string;
    fullName: string;
}

export interface IAccount {
    id: string
    roleId: string;
    password: string;
    fullName: string;
    accountCode: string;
    status: number;
    createTime?: any;
    updateTime?: any;
    createUser?: string;
    updateUser?: string;
}