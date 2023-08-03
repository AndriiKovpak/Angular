import * as internal from "stream";

export class userGrid {
    Id!:string;
    FullName!: string;
    Company!: string;
    Email!: string;
    UserStatus!: string;
    PhoneNumber!: string;
    Title!: string;
    Role!: string;
    SubscriptionDueDate!: Date;
    Licence!: BigInteger;
    Street!: string;
    City!: string;
    ZipCode!: string;
    State!: string;
    isEligibleForAMT!:boolean;
    dateTime!:Date;
    SelectedDepartmentIds!: number[];
}
