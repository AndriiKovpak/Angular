import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { AdminCompaniesAddComponent } from '../../core/modal/admin-companies-add/admin-companies-add.component';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import {
  companiesGrid,
} from '../companies/model/companiesGrid.moel';

@Component({
  selector: 'app-companies-admin',
  templateUrl: './companies-admin.component.html',
  styleUrls: ['./companies-admin.component.scss'],
})
export class CompaniesAdminComponent implements OnInit, AfterViewInit {
  //for paging
  pageIndex: number = 0;
  pageSize: number = 10;
  count: number = 5;
  activePage: number = 0;
  length: number = 2;

  activeInactiveList: any[] = [];
  isActive: boolean = true;

  //dataSource = new MatTableDataSource();
  baseUrl: string = environment.apiBase;
  adminUsersData: any;
  statusList: any;
  paginationArray: number[] = [5];
  rowData!: any;
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dataService: CrudService,
    public ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private toaster: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef,
    private tranlate: TranslateService,
    private translation: TranslationService,
  ) { }
  ngOnInit(): void {
    this.translation.onLanguageChange.subscribe((l: string) => {
      this.tranlate.setDefaultLang(l);
    })
    this.activeInactiveList = [
      { Text: "Active", Value: true },
      { Text: "Inactive", Value: false }
    ];
    this.getCompaniesGridData();
  }

  @ViewChild('MatPaginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  customCoursesActive: string = 'All';
  supplierPro: string = 'All';
  training: string = 'All';
  Calibration: string = 'All';
  CalibrationEnterprise: string = 'All';
  SpanishLanguage: string = 'All';

  //this to get active and inactive custom courses
  onCustomCoursesSelection() {
    this.customCoursesActive = 'Active';
  }
  obj: any = {
    name: '',
    licenses: 0,
    stripeId: '',
    promoCode: '',
    SubscriptionDueDate: '',
    customCoursesCreator: '',
    purchasedSupplierPro: '',
    purchasedCalibration: '',
    purchasedCalibrationEnterprise: '',
    purchasedSpanishLanguageCourse: '',
  };

  onBlurMethod(val: string, value: string) {

    switch (val) {
      case 'FullName':
        this.obj.name = value;
        this.getCompaniesGridData();
        break;
      case 'Licences':
        this.obj.licenses = +value;
        this.getCompaniesGridData();
        break;
      case 'StripeCustomerID':
        this.obj.stripeId = value;
        this.getCompaniesGridData();
        break;
      case 'PromoCode':
        this.obj.promoCode = value;
        this.getCompaniesGridData();
        break;
      case 'SubscriptionDueDate':
        if (value == '') {
          this.toaster.error('Please Select Date');
          return;
        } else {
          this.obj.SubscriptionDueDate = new Date(value).toDateString();
          this.getCompaniesGridData();
        }
        break;
      case 'customCoursesActive':
        this.supplierPro = 'All';
        this.Calibration = 'All';
        this.CalibrationEnterprise = 'All';
        this.training = 'All';
        this.SpanishLanguage = 'All';
        if (this.customCoursesActive == 'All')
          this.obj.customCoursesCreator = '';
        else
          this.obj.customCoursesCreator =
            this.customCoursesActive === 'Active' ? true : false;
        this.getCompaniesGridData();
        break;

      case 'supplierPro':
        this.customCoursesActive = 'All';
        this.Calibration = 'All';
        this.training = 'All';
        this.CalibrationEnterprise = 'All';
        this.SpanishLanguage = 'All';
        if (this.supplierPro == 'All') this.obj.purchasedSupplierPro = '';
        else
          this.obj.purchasedSupplierPro =
            this.supplierPro === 'Active' ? true : false;
        this.getCompaniesGridData();
        break;
      case 'training':
        this.customCoursesActive = 'All';
        this.supplierPro = 'All';
        this.CalibrationEnterprise = 'All';
        this.SpanishLanguage = 'All';
        if (this.training == 'All') this.obj.purchasedCalibration = '';
        else
          this.obj.purchasedTraining =
            this.training === 'Active' ? true : false;

        this.getCompaniesGridData();
        break;
      case 'Calibration':
        this.customCoursesActive = 'All';
        this.supplierPro = 'All';
        this.training = 'All';
        this.CalibrationEnterprise = 'All';
        this.SpanishLanguage = 'All';
        if (this.Calibration == 'All') this.obj.purchasedCalibration = '';
        else
          this.obj.purchasedCalibration =
            this.Calibration === 'Active' ? true : false;

        this.getCompaniesGridData();
        break;

      case 'CalibrationEnterprise':
        this.customCoursesActive = 'All';
        this.training = 'All';
        this.supplierPro = 'All';
        this.Calibration = 'All';
        this.SpanishLanguage = 'All';
        if (this.CalibrationEnterprise == 'All')
          this.obj.purchasedCalibrationEnterprise = '';
        else
          this.obj.purchasedCalibrationEnterprise =
            this.CalibrationEnterprise === 'Active' ? true : false;

        this.getCompaniesGridData();
        break;

      case 'SpanishLanguage':
        this.customCoursesActive = 'All';
        this.training = 'All';
        this.supplierPro = 'All';
        this.Calibration = 'All';
        this.CalibrationEnterprise = 'All';
        if (this.SpanishLanguage == 'All')
          this.obj.purchasedSpanishLanguageCourse = '';
        else
          this.obj.purchasedSpanishLanguageCourse =
            this.SpanishLanguage === 'Active' ? true : false;

        this.getCompaniesGridData();
        break;

      default:
        break;
    }
  }
  getCompaniesGridData() {
    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      name: this.obj.name,
      licenses: this.obj.licenses,
      stripeId: this.obj.stripeId,
      promoCode: this.obj.promoCode,
      SubscriptionDueDate: this.obj.SubscriptionDueDate,
      customCoursesCreator: this.obj.customCoursesCreator,
      purchasedSupplierPro: this.obj.purchasedSupplierPro,
      purchasedCalibration: this.obj.purchasedCalibration,
      purchasedCalibrationEnterprise: this.obj.purchasedCalibrationEnterprise,
      purchasedSpanishLanguageCourse: this.obj.purchasedSpanishLanguageCourse,
      purchasedTraining: this.obj.purchasedTraining,
      isDemo: this.filterOnlyDemoCompanies,
    };

    this.ngxLoader.start();
    this.dataService
      .postWithParams(
        this.baseUrl + ApiEndpointType.GetCompanies + !this.isActive,
        paging
      )
      .then((x: any) => {
        this.ngxLoader.stop();
        this.adminUsersData = x;

        if (this.adminUsersData.companyModelList.length > 0) {
          this.rowData = [];
          this.adminUsersData.companyModelList.forEach((element: any) => {
            let data = new companiesGrid();
            data.Name = element.name;
            data.Licences = element.noOfLicense;
            data.PromoCode = element.promoCode;
            data.StripeCustomerID = element.stripeCustomerId;
            data.SubscriptionDueDate = element.subscriptionRenualDate;
            data.Id = element.companyID;
            data.IsDeleted = element.isDeleted;
            data.PurchasedCustomCourseCreator =
              element.purchasedCustomCourseCreator;
            data.PurchasedSupplierPro = element.purchasedSupplierPro;
            data.PurchasedCalibration = element.purchasedCalibration;
            data.PurchasedTraining = element.purchasedTraining;
            data.PurchasedCalibrationEnterprise =
              element.purchasedCalibrationEnterprise;
            data.PurchasedSpanishLanguageCourse =
              element.purchasedSpanishLanguageCourse;
            data.EmailNotifications = element.emailNotifications;
            data.DateCreated = element.dateCreated;
            data.trainingMatricFormID = element.trainingMatricFormID;
            data.isDemo = element.isDemo;
            this.rowData.push(data);
          });
          this.dataSource.data = this.rowData;

          this.length = x.count;
          this.count = Number(this.adminUsersData.count);

          // this.count = Number(this.adminUsersData.count);
          // this.length = this.count;
          if (this.count <= 10) this.paginationArray = [10];
          else if (this.count <= 25) this.paginationArray = [10, 25];
          else if (this.count <= 50) this.paginationArray = [10, 25, 50];
          else if (this.count <= 100) this.paginationArray = [10, 25, 50, 100];
          else if (this.count > 100)
            this.paginationArray = [10, 25, 50, 100, this.count];
        } else {
          this.dataSource.data = [];
        }
        // this.dataSource.paginator = this.paginator;
      });
  }
  displayedColumnsCompanies: string[] = [
    'Name',
    'Licences',
    'StripeCustomerID',
    'PromoCode',
    'SubscriptionDueDate',
    'Training',
    'CustomCourses',
    'Spanish',
    'CalibrationProfessional',
    'CalibrationEnterprise',
    'SupplierPro',
    'edit',
  ];
  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    //if (this.pageIndex == 0) this.pageIndex = 1;
    this.getCompaniesGridData();
  }
  openModal() {
    const dialogRef = this.dialog.open(AdminCompaniesAddComponent);
  }
  exportToExcel(event: any) {
    let data = this.rowData;
    data.forEach((element: any) => {
      delete element['Id'];
    });
    this.excelService.downloadFile(data, 'Companies');
  }

  AddopenModal(element: any) {
    const dialogRef = this.dialog.open(AdminCompaniesAddComponent, {
      data: element,
    });
    dialogRef.afterClosed().subscribe((x) => {
      this.getCompaniesGridData();
      this.changeDetectorRefs.detectChanges();
    });
  }
  deleteCompany(id: string, val: boolean) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteCompaniesWithInActive2}/${id}/${val}`)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.getCompaniesGridData();
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }

  hardDeleteCompany(id: string) {
    if (confirm('Are you sure to permanant delete this record?')) {
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteCompany}/${id}`)
        .then((x: any) => {
          if (x && x.message) this.toaster.success(x.message, 'SUCCESS');
          this.getCompaniesGridData();
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        })
    }
  }

  toggle(event: any, element: any) {
    element.PurchasedCustomCourseCreator = event.checked;
    let data: any = {
      companyID: element.Id,
      dateCreated: element.DateCreated,
      emailNotifications: element.EmailNotifications,
      isDeleted: element.IsDeleted,
      name: element.Name,
      noOfLicense: element.Licences,
      promoCode: element.PromoCode,
      purchasedCustomCourseCreator: element.PurchasedCustomCourseCreator,
      stripeCustomerId: element.StripeCustomerID,
      subscriptionRenualDate: element.SubscriptionDueDate,
      trainingMatricFormID: element.trainingMatricFormID,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.SwitchCustomCoursesCreator, data)
      .then((x: any) => {
        this.toaster.success(x.message, 'SUCCESS');
        // this.getCompaniesGridData();
      })
      .catch((x) => {
        this.toaster.error(x.error, 'ERROR');
        event.checked = !event.checked;
        element.purchasedCustomCourseCreator = event.checked;
      });
  }

  Trainingtoggle(event: any, element: any) {
    element.PurchasedTraining = event.checked;
    let data: any = {
      companyID: element.Id,
      dateCreated: element.DateCreated,
      emailNotifications: element.EmailNotifications,
      isDeleted: element.IsDeleted,
      name: element.Name,
      noOfLicense: element.Licences,
      promoCode: element.PromoCode,
      purchasedSupplierPro: element.purchasedSupplierPro,
      purchasedTraining: element.PurchasedTraining,
      stripeCustomerId: element.StripeCustomerID,
      subscriptionRenualDate: element.SubscriptionDueDate,
      trainingMatricFormID: element.trainingMatricFormID,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.SwitchpurchasedTraining, data)
      .then((x: any) => {
        this.toaster.success(x.message, 'SUCCESS');
        // this.getCompaniesGridData();
      })
      .catch((x) => {
        this.toaster.error(x.error, 'ERROR');
        event.checked = !event.checked;
        element.PurchasedTraining = event.checked;
      });
  }

  SupplierProtoggle(event: any, element: any) {
    element.purchasedSupplierPro = event.checked;
    let data: any = {
      companyID: element.Id,
      dateCreated: element.DateCreated,
      emailNotifications: element.EmailNotifications,
      isDeleted: element.IsDeleted,
      name: element.Name,
      noOfLicense: element.Licences,
      promoCode: element.PromoCode,
      purchasedSupplierPro: element.purchasedSupplierPro,
      stripeCustomerId: element.StripeCustomerID,
      subscriptionRenualDate: element.SubscriptionDueDate,
      trainingMatricFormID: element.trainingMatricFormID,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.SwitchpurchasedSupplierPro, data)
      .then((x: any) => {
        this.toaster.success(x.message, 'SUCCESS');
        // this.getCompaniesGridData();
      })
      .catch((x) => {
        this.toaster.error(x.error, 'ERROR');
        event.checked = !event.checked;
        element.purchasedSupplierPro = event.checked;
      });
  }

  Calibrationtoggle(event: any, element: any) {
    element.purchasedCalibration = event.checked;
    let data: any = {
      companyID: element.Id,
      dateCreated: element.DateCreated,
      emailNotifications: element.EmailNotifications,
      isDeleted: element.IsDeleted,
      name: element.Name,
      noOfLicense: element.Licences,
      promoCode: element.PromoCode,
      purchasedCalibration: element.purchasedCalibration,
      stripeCustomerId: element.StripeCustomerID,
      subscriptionRenualDate: element.SubscriptionDueDate,
      trainingMatricFormID: element.trainingMatricFormID,
    };
    this.dataService
      .post(this.baseUrl + ApiEndpointType.SwitchpurchasedCalibration, data)
      .then((x: any) => {
        this.toaster.success(x.message, 'SUCCESS');
        // this.getCompaniesGridData();
      })
      .catch((x) => {
        this.toaster.error(x.error, 'ERROR');
        event.checked = !event.checked;
        element.purchasedCalibration = event.checked;
      });
  }

  CalibrationEnterprisetoggle(event: any, element: any) {
    element.purchasedCalibrationEnterprise = event.checked;
    let data: any = {
      companyID: element.Id,
      dateCreated: element.DateCreated,
      emailNotifications: element.EmailNotifications,
      isDeleted: element.IsDeleted,
      name: element.Name,
      noOfLicense: element.Licences,
      promoCode: element.PromoCode,
      purchasedCalibrationEnterprise: element.purchasedCalibrationEnterprise,
      stripeCustomerId: element.StripeCustomerID,
      subscriptionRenualDate: element.SubscriptionDueDate,
      trainingMatricFormID: element.trainingMatricFormID,
    };
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.SwitchpurchasedCalibrationEnterprise,
        data
      )
      .then((x: any) => {
        this.toaster.success(x.message, 'SUCCESS');
        // this.getCompaniesGridData();
      })
      .catch((x) => {
        this.toaster.error(x.error, 'ERROR');
        event.checked = !event.checked;
        element.purchasedCalibrationEnterprise = event.checked;
      });
  }

  SpanishLanguagetoggle(event: any, element: any) {
    element.purchasedSpanishLanguageCourse = event.checked;
    let data: any = {
      companyID: element.Id,
      dateCreated: element.DateCreated,
      emailNotifications: element.EmailNotifications,
      isDeleted: element.IsDeleted,
      name: element.Name,
      noOfLicense: element.Licences,
      promoCode: element.PromoCode,
      purchasedSpanishLanguageCourse: element.purchasedSpanishLanguageCourse,
      stripeCustomerId: element.StripeCustomerID,
      subscriptionRenualDate: element.SubscriptionDueDate,
      trainingMatricFormID: element.trainingMatricFormID,
    };
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.SwitchpurchasedSpanishLanguageCourse,
        data
      )
      .then((x: any) => {
        this.toaster.success(x.message, 'SUCCESS');
        // this.getCompaniesGridData();
      })
      .catch((x) => {
        this.toaster.error(x.error, 'ERROR');
        event.checked = !event.checked;
        element.purchasedSpanishLanguageCourse = event.checked;
      });
  }

  filterOnlyDemoCompanies: boolean = false;
  getSelectedCompanyCourses(event: any) {
    if (event.value == 'demo') {
      this.filterOnlyDemoCompanies = true;
    } else {
      this.filterOnlyDemoCompanies = false;
    }
    this.getCompaniesGridData();
  }
}
