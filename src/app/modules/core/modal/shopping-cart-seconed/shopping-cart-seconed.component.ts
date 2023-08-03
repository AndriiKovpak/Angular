import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { AuthService } from '../../guards/auth.service';

@Component({
  selector: 'app-shopping-cart-seconed',
  templateUrl: './shopping-cart-seconed.component.html',
  styleUrls: ['./shopping-cart-seconed.component.scss'],
})
export class ShoppingCartSeconedComponent implements OnInit {
  //purchased custom courses check
  purchasedCustomCoursesCreator: boolean = false;
  baseUrl: string = environment.apiBase;

  //purchased spanish language check
  purchasedLanguageCreater: boolean = false;

  //Licenses Total Price
  LicensesTotalPrice: number = 0;
  TotalCheckoutPrice: number = 0;
  CustomCoursePricePerUser: number = 0;
  CustomCoursesCreatorPrice: number = 0;
  NoOfTotalLicences: number = 0;
  openShoppingModalToggle: boolean = false;
  CustomCourseCheckboxValueChecked: boolean = false;
  modifiedValueOfLicenses: number = 0;
  customCoursePrice: number = 0;
  noCustomCoursePrice: number = 0;
  priceWithoutSpanish: number = 0;
  gaugeProCheck: boolean = false;

  //spanish language purchase
  spanishLanguagePrice: number = 0;
  isSpanishCoursesPurchased: boolean = false;
  userInfo: any;

  flagCustom: boolean = false;
  flagSpanish: boolean = false;
  activeLicences:number =0;

  constructor(
    private dialogRef: MatDialogRef<ShoppingCartSeconedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CrudService,
    private authService: AuthService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {

    let number:any=  localStorage.getItem('number');
    this.activeLicences = +number;
    if(this.activeLicences ==0){
      this.PurchaseLicenseValueChange(10)
    }

    this.userInfo = this.authService.getUserInformation();
    this.NoOfTotalLicences = this.data.totalNumberOfLincenses;

    if (this.data.openShoppingModalToggle)
      this.CustomCourseCheckboxValueChange(this.data.openShoppingModalToggle);

    if (this.data.purchasedSpanishCardToggele)
      this.spanishCoursePriceEvaluate(this.data.purchasedSpanishCardToggele);
    if (this.data && this.data.PurchasedCustomCoursesCreator)
      this.flagCustom = true;
    if (this.data && this.data.PurchasedSpanishLanguageCourse)
      this.flagSpanish = true;
  }

  //this function is used to close the modal
  onCancel(): void {
    this.dialogRef.close();
  }

  //this function is used to add the data to the admins this data will send to
  //report and setting component
  onSubmit(): void {
    this.dialogRef.close();
  }

  numberOfNewLicences: number = 0;
  //calculate total price
  public PurchaseLicenseValueChange(purchaseLicenseValue: any) {
    let puchasedLicencses = +purchaseLicenseValue;
    this.numberOfNewLicences = puchasedLicencses;

    // StripePurchaseLicensesViewModel.NoOfLicense = purchaseLicenseValue;
    this.modifiedValueOfLicenses = puchasedLicencses;
    if (this.data.PurchasedCustomCoursesCreator) {
      this.LicensesTotalPrice =
        puchasedLicencses * this.data.CustomCoursesAndSoftwarePricePerUser;
      // if (this.isSpanishCoursesPurchased) {
      //     this.spanishLanguagePrice = (this.modifiedValueOfLicenses + ) * this.data.costPerLicenseSpanishLanguage;
      this.TotalCheckoutPrice = this.LicensesTotalPrice;
    } else {
      this.LicensesTotalPrice =
        puchasedLicencses * this.data.PricePerUserTraning;
      this.TotalCheckoutPrice = this.LicensesTotalPrice;

      if (
        this.data.IsCustomCoursesPurchased &&
        this.isSpanishCoursesPurchased
      ) {
        if (this.CustomCourseCheckboxValueChecked)
          this.CustomCoursesCreatorPrice =
            (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
            this.data.costPerLicense;
        if (this.isSpanishCoursesPurchased)
          this.spanishLanguagePrice =
            (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
            this.data.costPerLicenseSpanishLanguage;

        this.TotalCheckoutPrice =
          this.LicensesTotalPrice +
          this.spanishLanguagePrice +
          this.CustomCoursesCreatorPrice;
      } else if (this.data.IsCustomCoursesPurchased) {
        //     this.CustomCoursesCreatorPrice =puchasedLicencses* this.data.costPerLicense;
        // else
        if (this.CustomCourseCheckboxValueChecked)
          this.CustomCoursesCreatorPrice =
            (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
            this.data.costPerLicense;

        this.TotalCheckoutPrice =
          this.LicensesTotalPrice + this.CustomCoursesCreatorPrice;
      } else if (this.isSpanishCoursesPurchased) {
        this.spanishLanguagePrice =
          (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
          this.data.costPerLicenseSpanishLanguage;

        this.TotalCheckoutPrice =
          this.LicensesTotalPrice + this.spanishLanguagePrice;
      }
    }
    this.addSupplierAndGaugePrice();
  }
  CustomCourseCheckboxValueChangeChecked: boolean = false;
  //this function is triggered when we check and uncheck the checkbox
  public CustomCourseCheckboxValueChange(customCourseValue: any) {
    let changedLicenceCount: number = 0;
    this.CustomCourseCheckboxValueChecked =
      customCourseValue == true
        ? customCourseValue
        : customCourseValue.target.checked;

    if (customCourseValue?.target?.checked || customCourseValue == true) {
      this.CustomCourseCheckboxValueChangeChecked =
        customCourseValue?.target?.checked;
      this.CustomCourseCheckboxValueChangeChecked =
        customCourseValue?.target?.checked;

      this.data.IsCustomCoursesPurchased =
        customCourseValue == true
          ? customCourseValue
          : customCourseValue.target.checked;
      changedLicenceCount = +this.modifiedValueOfLicenses;

      if (!this.data.PurchasedCustomCoursesCreator)
        this.CustomCoursesCreatorPrice =
          (changedLicenceCount + this.NoOfTotalLicences) *
          this.data.costPerLicense;
      else
        this.CustomCoursesCreatorPrice =
          changedLicenceCount * this.data.costPerLicense;
    } else {
      this.CustomCourseCheckboxValueChangeChecked = false;
      this.data.IsCustomCoursesPurchased = false;
      this.CustomCoursesCreatorPrice = 0;
    }
    //  this.TotalCheckoutPrice = this.CustomCoursesCreatorPrice + this.LicensesTotalPrice;
    this.finalPrice();
  }

  /**
   *  spanishCoursePriceEvaluate
   */
  checkBoxCheck: boolean = false;
  public spanishCoursePriceEvaluate(customCourseValue: any) {
    let changedLicenceCount: number = 0;

    if (customCourseValue?.target?.checked || customCourseValue == true) {
      this.checkBoxCheck = customCourseValue?.target?.checked ? true : false;
      this.checkBoxCheck = customCourseValue ? true : false;

      this.isSpanishCoursesPurchased =
        customCourseValue == true
          ? customCourseValue
          : customCourseValue.target.checked;
      changedLicenceCount = +this.modifiedValueOfLicenses;

      if (this.data.purchasedSpanishCardToggele)
        this.spanishLanguagePrice =
          (changedLicenceCount + this.NoOfTotalLicences) *
          this.data.costPerLicenseSpanishLanguage;
      else
        this.spanishLanguagePrice =
          changedLicenceCount * this.data.costPerLicenseSpanishLanguage;
    } else {
      this.checkBoxCheck = false;
      this.isSpanishCoursesPurchased = false;
      this.spanishLanguagePrice = 0;
    }

    this.finalPrice();
    //this.TotalCheckoutPrice = this.spanishLanguagePrice + this.LicensesTotalPrice;
  }

  //this function is to calculate the final price
  finalPrice() {
    if (!this.data.IsCustomCoursesPurchased && !this.isSpanishCoursesPurchased)
      this.TotalCheckoutPrice =
        this.spanishLanguagePrice +
        this.CustomCoursesCreatorPrice +
        this.LicensesTotalPrice;
    else if (
      this.data.IsCustomCoursesPurchased &&
      this.isSpanishCoursesPurchased
    )
      this.TotalCheckoutPrice =
        this.spanishLanguagePrice +
        this.CustomCoursesCreatorPrice +
        this.LicensesTotalPrice;
    else if (this.isSpanishCoursesPurchased)
      this.TotalCheckoutPrice =
        this.spanishLanguagePrice + this.LicensesTotalPrice;
    else if (this.data.IsCustomCoursesPurchased)
      this.TotalCheckoutPrice =
        this.CustomCoursesCreatorPrice + this.LicensesTotalPrice;
    else if (!this.isSpanishCoursesPurchased)
      this.TotalCheckoutPrice =
        this.spanishLanguagePrice + this.LicensesTotalPrice;
    else if (!this.data.IsCustomCoursesPurchased)
      this.TotalCheckoutPrice =
        this.CustomCoursesCreatorPrice + this.LicensesTotalPrice;

    this.addSupplierAndGaugePrice();
  }

  //add the gauge pro value 399 dollars
  GaugeProValueChange(val: any) {
    if (this.calibrationEnterpriseCheck) {
      this.calibrationEnterpriseCheck = false;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice - 1495;
    }
    if (val.target.checked) {
      this.gaugeProCheck = true;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 795;
    } else {
      this.gaugeProCheck = false;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice - 795;
    }
  }

  //add the gauge pro value 1495 dollars
  CalibrationEnterPriseValueChange(val: any) {
    if (this.gaugeProCheck) {
      this.gaugeProCheck = false;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice - 795;
    }
    if (val.target.checked) {
      this.calibrationEnterpriseCheck = true;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 1495;
    } else {
      this.calibrationEnterpriseCheck = false;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice - 1495;
    }
  }

  supplierProCheck: boolean = false;
  //add the supplier pro value 399 dollars
  supplierProValuechange(val: any) {
    if (val.target.checked) {
      this.supplierProCheck = true;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 399;
    } else {
      this.supplierProCheck = false;
      this.TotalCheckoutPrice = this.TotalCheckoutPrice - 399;
    }
  }
  showPriceWithOutSpanish: number = 0;
  showPriceWithSpanish: number = 0;
  calibrationEnterpriseCheck: boolean = false;
  //this is to add the gauge  and supplier price
  addSupplierAndGaugePrice() {
    if (this.gaugeProCheck && this.supplierProCheck)
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 399 + 795;
    else if (this.calibrationEnterpriseCheck && this.supplierProCheck)
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 399 + 1495;
    else if (this.gaugeProCheck)
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 795;
    else if (this.supplierProCheck)
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 399;
    else if (this.calibrationEnterpriseCheck)
      this.TotalCheckoutPrice = this.TotalCheckoutPrice + 1495;
  }

  //calculate total price with type
  public PurchaseLicenseValueChangeWithType(
    purchaseLicenseValue: any,
    type: any
  ) {
    let puchasedLicencses = +purchaseLicenseValue;
    // StripePurchaseLicensesViewModel.NoOfLicense = purchaseLicenseValue;
    this.modifiedValueOfLicenses = puchasedLicencses;
    if (this.checkBoxCheck) {
      this.spanishCoursePriceEvaluate(this.checkBoxCheck);
    }
    if (this.CustomCourseCheckboxValueChangeChecked) {
      this.CustomCourseCheckboxValueChange(
        this.CustomCourseCheckboxValueChangeChecked
      );
    }
    this.numberOfNewLicences = puchasedLicencses;

    if (this.data.PurchasedCustomCoursesCreator) {
      if (type === 'Custom') {
        this.LicensesTotalPrice =
          puchasedLicencses * this.data.CustomCoursesAndSoftwarePricePerUser;

        this.customCoursePrice = this.LicensesTotalPrice;
      } else {
        if (type == 'noCustom') {
          this.LicensesTotalPrice =
            puchasedLicencses * this.data.MyExCoursesAlternative;
          this.showPriceWithOutSpanish =
            puchasedLicencses * this.data.MyExCoursesAlternative;
          this.noCustomCoursePrice = this.LicensesTotalPrice;
        } else {
          this.LicensesTotalPrice =
            puchasedLicencses * this.data.MyExCoursesWithoutSpanish;
          this.showPriceWithSpanish =
            puchasedLicencses * this.data.MyExCoursesWithoutSpanish;
          this.priceWithoutSpanish = this.LicensesTotalPrice;
        }
      }
      if (this.checkBoxCheck)
        this.spanishLanguagePrice =
          (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
          this.data.costPerLicenseSpanishLanguage;
      else this.spanishLanguagePrice = 0;

      this.TotalCheckoutPrice =
        this.customCoursePrice +
        this.noCustomCoursePrice +
        this.priceWithoutSpanish +
        this.spanishLanguagePrice;
    } else if (!this.data.PurchasedCustomCoursesCreator) {
      if (type == 'noCustom') {
        this.LicensesTotalPrice =
          puchasedLicencses * this.data.MyExCoursesAlternative;
        this.showPriceWithOutSpanish =
          puchasedLicencses * this.data.MyExCoursesAlternative;
        this.noCustomCoursePrice = this.LicensesTotalPrice;
        this.TotalCheckoutPrice =
          this.LicensesTotalPrice + this.CustomCoursesCreatorPrice;
      } else {
        this.LicensesTotalPrice =
          puchasedLicencses * this.data.MyExCoursesWithoutSpanish;
        this.showPriceWithSpanish =
          puchasedLicencses * this.data.MyExCoursesWithoutSpanish;
        this.priceWithoutSpanish = this.LicensesTotalPrice;
      }
    } else {
      this.LicensesTotalPrice =
        puchasedLicencses * this.data.PricePerUserTraning;
      this.TotalCheckoutPrice = this.LicensesTotalPrice;

      if (
        this.data.IsCustomCoursesPurchased &&
        this.isSpanishCoursesPurchased
      ) {
        if (this.CustomCourseCheckboxValueChecked)
          this.CustomCoursesCreatorPrice =
            (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
            this.data.costPerLicense;
        if (this.isSpanishCoursesPurchased)
          this.spanishLanguagePrice =
            (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
            this.data.costPerLicenseSpanishLanguage;

        this.TotalCheckoutPrice =
          this.LicensesTotalPrice +
          this.spanishLanguagePrice +
          this.CustomCoursesCreatorPrice;
      } else if (this.data.IsCustomCoursesPurchased) {
        //     this.CustomCoursesCreatorPrice =puchasedLicencses* this.data.costPerLicense;
        // else
        if (this.CustomCourseCheckboxValueChecked)
          this.CustomCoursesCreatorPrice =
            (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
            this.data.costPerLicense;

        this.TotalCheckoutPrice =
          this.LicensesTotalPrice + this.CustomCoursesCreatorPrice;
      } else if (this.isSpanishCoursesPurchased) {
        this.spanishLanguagePrice =
          (this.modifiedValueOfLicenses + this.NoOfTotalLicences) *
          this.data.costPerLicenseSpanishLanguage;

        this.TotalCheckoutPrice =
          this.LicensesTotalPrice + this.spanishLanguagePrice;
      }
    }
    this.addSupplierAndGaugePrice();
  }

  checkout() {

    if (this.TotalCheckoutPrice == 0) {
      this.toaster.error('Subtotal should be greater than $0.');
      return;
    }
    const url = `${environment.baseUri}companyadmin/payment-success/`;

    let data: any = {
      email: this.userInfo.userName,
      baseUri: url,
      noOfLicense: this.numberOfNewLicences,
      noOfActiveLicenses: this.NoOfTotalLicences,
      isCustomCoursesPurchased: this.CustomCourseCheckboxValueChecked,
      softwarePlusCustomCoursesPurchase: false,
      SpanishLanguagePurchase: this.isSpanishCoursesPurchased,
      CalibrationPurchase: this.gaugeProCheck,
      CalibrationPurchaseEnterprise:this.calibrationEnterpriseCheck,
      supplierMangementPurchase: this.supplierProCheck,
      SoftwarePlusCustomCoursesPurchaseWithoutSpanish:
        this.flagCustom && !this.flagSpanish ? true : false,
      SoftwarePlusCustomCoursePricePerUserPlusSpanish:
        this.flagCustom && this.flagSpanish ? true : false,
      PricePerUserPlusSpanish:
        !this.flagCustom && this.flagSpanish ? true : false,
    };
    this.service
      .post(this.baseUrl + ApiEndpointType.CreateCheckoutSessionAsync, data)
      .then((x: any) => {
        if (x) window.location.href = x;
      })
      .catch((x) => {});
  }
}
