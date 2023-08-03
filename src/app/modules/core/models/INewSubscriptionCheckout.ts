export interface INewSubscriptionCheckout {
  companyId: number;
  successReturnUri: string;
  failureReturnUri: string;
  promoCode: string;
  numberOfTrainingLicenses: number;
  trainingCustomCoursesPurchased: boolean;
  trainingIsSpanishPurchased: boolean;
  calibrationPurchaseProfessional: boolean;
  calibrationPurchaseEnterprise: boolean;
}
