export class AddGaugeFormModel {
    Id!: bigint;
    GaugeId!: string;
    status!: number;
    SupplierId!: string;
    CertificateNumber!: string;
    StandardId!: number;
    Result!: boolean;
    IsDeleted!:boolean;
    CalibrationDate!:Date;
    Frequency!:number;
    AddedBy!:string;
    Notes!:string;
    Description!: string;
    MeasureUnit!: string;
    ModelNumber!: string;
    SerialNumber!: string;
    OwnerId!:number;
    ManufacturerId!:number;
    LocationId!:number;
    NewDate!:Date;
    RetirementDate!:Date;
    Emails!: string;
    CompanyID!:number;
    CreatedDate!:Date;
    UpdatedDate!:Date;
    UpdatedBy!:string;
}