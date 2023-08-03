
export interface CompanyModel {
    companyID?: number
    name: string
    trainingMatricFormID: string
    noOfLicense?: number
    stripeCustomerId: string
    promoCode: string
    emailNotifications: boolean
    supervisorEmailNotifications: string
    subscriptionRenualDate: string
    isDeleted?: boolean
    dateCreated: Date
    purchasedCustomCourseCreator: boolean,
    purchasedCalibration: boolean,
    purchasedCalibrationEnterprise: boolean,
    isDemo: boolean
    lockUsersCredentials: boolean
    lockUsersProfile: boolean
    purchasedSpanishLanguageCourse: boolean,
    purchasedSupplierPro: boolean,
    purchasedTraining: boolean,
}