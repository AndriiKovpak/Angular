export interface admin{
    id: number;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    fullName: string;
    supervisorEmail: string;
    phoneNumber: string;
    companyID: number;
    isSafetySensitive: boolean;
    safetySensitiveType?:number
    userStatusID: number;
    userStatusName: string;
    SelectedDepartmentIds: any[];
    companyName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    confirmPassword:string
    password:string
}
