import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { ShoppingCartModalComponent } from '../../core/modal/shopping-cart-modal/shopping-cart-modal.component';
import { ShoppingCartSeconedComponent } from '../../core/modal/shopping-cart-seconed/shopping-cart-seconed.component';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  baseUrl: string = environment.apiBase;
  totalNumberOfLincenses: number = 0;
  PurchasedCustomCoursesCreator: boolean = false;
  PricePerUserTraning: number = 0;
  costPerLicense: number = 0;
  costPerLicenseSpanishLanguage: number = 0;
  IsCustomCoursesPurchased: boolean = false;
  CustomCoursesAndSoftwarePricePerUser: number = 0;
  GaugeProPrice: number = 0;
  CalibrationEnterPrise: number = 0;
  SupplierProPrice: number = 0;
  MyExCoursesAlternative: number = 0;
  MyExCoursesWithoutSpanish: number = 0;
  openShoppingModalToggle: boolean = false;
  userInfo: any;

  //shopping cart for spanish language
  purchasedSpanishLanguage: boolean = false;
  purchasedSpanishCardToggele: boolean = false;

  roleUser: boolean = false;
  roleRead: boolean = false;
  roleSupplier: boolean = false;
  roleAdmin: boolean = false;
  overDueCount: number = 0;

  url: string = '';
  constructor(
    private service: CrudService,
    public matDialog: MatDialog,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private authService: AuthService,
    private router: Router,
    private loader: NgxUiLoaderService,
    public translate: TranslateService,
    public translationService: TranslationService,
  ) { }

  ngOnInit(): void {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
    this.updateUserInfo();
    this.getUserStatus();
    this.GetCompanyOverDueGauge();
  }

  saveDataOnPaymentSuccess() {
    this.service
      .getAll(`${this.baseUrl + ApiEndpointType.Checkout}/${this.url}`)
      .then((x: any) => {
        if (x) {
          this.toaster.success(x.message, 'SUCCESS');
          this.updateUserInfo();
          this.router.navigate(['/main-page']);
        }
      })
      .catch((x) => { });
  }
  companyStats: any;
  getUserStatus() {
    this.loader.start();
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyStat)
      .then((x) => {
        this.loader.stop();
        this.companyStats = x;
        localStorage.setItem('number', this.companyStats?.numberOfLicensesActive)
      })
      .catch((x) => { });
  }

  //Get Total Licenses
  GetTotalLicenses() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetTotalLicenses)
      .then((result: any) => {
        if (result) {
          this.PurchasedCustomCoursesCreator =
            result.purchasedCustomCoursesCreator;
          this.totalNumberOfLincenses = result.noOfTotalLicenses;
          this.IsCustomCoursesPurchased = this.PurchasedCustomCoursesCreator;
        }
      });
  }
  companyData: any = {};
  updateUserInfo() {
    this.service
      .getAll(this.baseUrl + '/api/Authorize/user')
      .then((res: any) => {
        localStorage.removeItem('userDetails');
        localStorage.setItem('userDetails', JSON.stringify(res));
        this.userInfo = this.authService.getUserInformation();
        let userId = this.userInfo.userId;
        this.auth();
        if (!this.roleAdmin) {
          this.service
      .getAll(this.baseUrl + ApiEndpointType.GetOverDueCount + '/' + userId)
      .then(x => {
        this.overDueCount = x as number;
      })
        }
        this.GetCompanyByUser(userId);
        this.GetTotalLicenses();
      });
  }

  // get companies by user
  GetCompanyByUser(userId: string) {
    this.service
      .getAll(
        this.baseUrl + ApiEndpointType.GetCompanyByUserMainPage + '/' + userId
      )
      .then((x: any) => {
        if (x) {
          this.companyData = x;
        }
      })
      .catch((y: any) => { });
  }
  openShoppingModal() {
    setTimeout(() => {
      if (
        !this.PurchasedCustomCoursesCreator &&
        !this.companyData.purchasedSpanishLanguageCourse
      ) {
        const dialogRef = this.dialog.open(ShoppingCartModalComponent, {
          data: {
            totalNumberOfLincenses: this.totalNumberOfLincenses,
            PurchasedCustomCoursesCreator: this.PurchasedCustomCoursesCreator,
            PricePerUserTraning: this.PricePerUserTraning,
            costPerLicense: this.costPerLicense,
            IsCustomCoursesPurchased: this.PurchasedCustomCoursesCreator,
            CustomCoursesAndSoftwarePricePerUser:
              this.CustomCoursesAndSoftwarePricePerUser,
            openShoppingModalToggle: this.openShoppingModalToggle,
            purchasedSpanishCardToggele: this.purchasedSpanishCardToggele,
            costPerLicenseSpanishLanguage: this.costPerLicenseSpanishLanguage,
            GaugeProPrice: this.GaugeProPrice,
            SupplierProPrice: this.SupplierProPrice,
            MyExCoursesAlternative: this.MyExCoursesAlternative,
            MyExCoursesWithoutSpanish: this.MyExCoursesWithoutSpanish,
            PurchasedSupplierPro: this.companyData.purchasedSupplierPro,
            PurchasedCalibration: this.companyData.purchasedCalibration,
            PurchasedSpanishLanguageCourse: this.companyData.purchasedSpanishLanguageCourse,
            PurchasedCalibrationEnterprise: this.companyData.purchasedCalibrationEnterprise,
            CalibrationEnterPrise: this.CalibrationEnterPrise,
          },
        });

        dialogRef.afterClosed().subscribe((x: any) => {
          this.GetCompanyByUser(this.userInfo.userId);
          this.GetTotalLicenses();
        });
      } else {
        const dialogRef = this.dialog.open(ShoppingCartSeconedComponent, {
          data: {
            totalNumberOfLincenses: this.totalNumberOfLincenses,
            PurchasedCustomCoursesCreator: this.PurchasedCustomCoursesCreator,
            PricePerUserTraning: this.PricePerUserTraning,
            costPerLicense: this.costPerLicense,
            IsCustomCoursesPurchased: this.PurchasedCustomCoursesCreator,
            CustomCoursesAndSoftwarePricePerUser: this.CustomCoursesAndSoftwarePricePerUser,
            openShoppingModalToggle: this.openShoppingModalToggle,
            purchasedSpanishCardToggele: this.purchasedSpanishCardToggele,
            costPerLicenseSpanishLanguage: this.costPerLicenseSpanishLanguage,
            GaugeProPrice: this.GaugeProPrice,
            SupplierProPrice: this.SupplierProPrice,
            MyExCoursesAlternative: this.MyExCoursesAlternative,
            MyExCoursesWithoutSpanish: this.MyExCoursesWithoutSpanish,
            PurchasedSupplierPro: this.companyData.purchasedSupplierPro,
            PurchasedCalibration: this.companyData.purchasedCalibration,
            PurchasedSpanishLanguageCourse: this.companyData.purchasedSpanishLanguageCourse,
            PurchasedCalibrationEnterprise: this.companyData.purchasedCalibrationEnterprise,
            CalibrationEnterPrise: this.CalibrationEnterPrise,
          },
        });

        dialogRef.afterClosed().subscribe((x: any) => {
          this.GetCompanyByUser(this.userInfo.userId);
          this.GetTotalLicenses();
        });
      }
    }, 1500);
  }

  navigateToCalibrationDashboard() {
    if (!Object.keys(this.companyData).length) return
    if (
      this.companyData.purchasedCalibration ||
      this.companyData.purchasedCalibrationEnterprise
    )
      this.router.navigate(['/companyadmin/calibration-dashboard']);
    else this.openShoppingModal();
  }

  navigateToTrainingDashboard() {
    if (!Object.keys(this.companyData).length) return
    if (this.companyData.purchasedTraining) {
      if (this.roleAdmin) {
        this.router.navigate(['/companyadmin/dashboard']);
      } else {
        this.router.navigate(['/employee-home/companies']);
      }
    }
    else
      this.openShoppingModal();
  }

  companygaugeoverDue: any;
  GetCompanyOverDueGauge() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyOverDueGauge)
      .then((x: any) => {
        this.companygaugeoverDue = x.gaugesOverDue;
      })
      .catch((x) => { });
  }

  auth() {
    if (this.userInfo.role) {
      let roleArray = (this.userInfo.role as string).split(',').map(e => e.toLowerCase())
      this.roleRead = roleArray.includes("supplier");
      this.roleSupplier = roleArray.includes("read");
      this.roleUser = roleArray.includes("user");
      this.roleAdmin = roleArray.includes("companyadmin");
    }
  }
}
