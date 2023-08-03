import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DebugElement,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { AuthService } from '../../core/guards/auth.service';
import { company } from './models/company.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { CompanyDepartmentModel } from '../assessments/models/companyDepartment.model';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CompanyDepartment } from './models/companyDepartment.model';
import { AdminControlModalComponent } from '../../core/modal/admin-control-modal/admin-control-modal.component';
import { FileSaverService } from 'ngx-filesaver';
import { ShoppingCartModalComponent } from '../../core/modal/shopping-cart-modal/shopping-cart-modal.component';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCartSeconedComponent } from '../../core/modal/shopping-cart-seconed/shopping-cart-seconed.component';

@Component({
  selector: 'app-reports-settings',
  templateUrl: './reports-settings.component.html',
  styleUrls: ['./reports-settings.component.scss'],
})
export class ReportsSettingsComponent implements OnInit, AfterViewInit {
  baseUrl: string = environment.apiBase;
  userInfo: any;
  companyOfUser: any;
  accountName: boolean = false;

  //this is used for material toggle radio buttons
  emailNotifications: boolean = false;
  SupervisorEmailNotifications: boolean = false;
  customCoursesCreator: boolean = false;
  editShow: boolean = true;
  editShowTraining: boolean = true;
  public toggleButton: boolean = true;

  //variables for departments
  name = new FormControl('');
  dataSource = new MatTableDataSource<CompanyDepartmentModel>();

  //the columns that we need to display in table
  displayedColumns: string[] = ['name', 'edit', 'delete'];

  //variable used for Admin Controls
  FirstName = new FormControl('');
  displayedColumnsAdmin: string[] = ['firstName', 'delete'];
  dataSourceAdmin: any;

  //custom courses active and inactive
  customCoursesActive: string = 'Active';
  customCoursesColumnsDisplay: string[] = [
    'course',
    'frequency',
    'dueDateFromStartDate',
    'delete',
  ];
  dataSourceCustomCourses = new MatTableDataSource<any>();
  activeCustomCourses: boolean = false;
  hidetickCustom: boolean = false;

  //frequency data
  frequencyData: any[] = [];

  //paging
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  pageSize: number = 1;
  length!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //myex courses variables
  myexCoursesActive: string = 'Active';
  myexCoursesColumnsDisplay: string[] = [
    'course',
    'frequency',
    'dueDateFromStartDate',
    'delete',
  ];
  dataSourceMyexCourses = new MatTableDataSource<any>();
  hideTickMyExCourses: boolean = false;
  activeMyExCourses: boolean = false;

  //add department
  addDepartments: boolean = false;
  @ViewChild('addDepDiv') addDepDiv!: ElementRef;

  @ViewChild('nameOfUser') button: any;

  //get all company users
  allCompanyUsers: any[] = [];

  //shopping cart
  totalNumberOfLincenses: number = 0;
  PurchasedCustomCoursesCreator: boolean = false;
  PricePerUserTraning: number = 149;
  costPerLicense: number = 67;
  costPerLicenseSpanishLanguage: number = 26;
  IsCustomCoursesPurchased: boolean = false;
  CustomCoursesAndSoftwarePricePerUser: number = 242;
  GaugeProPrice: number = 795;
  SupplierProPrice: number = 399;
  MyExCoursesAlternative: number = 175;
  MyExCoursesWithoutSpanish: number = 216;

  //toedit the departments
  editDepartmentsCheck: boolean = false;
  editDepValue: string = '';
  editRecord: any;
  openShoppingModalToggle: boolean = false;
  companyId: number = 0;

  // AMT Awards Year in report section
  dateForm: any = new FormControl();
  selectYear: any = new Date().getFullYear();
  firstDateOfYear: Date = new Date(this.selectYear, 0, 1);
  lastDateOfYear: Date = new Date(this.selectYear + 1, 0, 0);

  //shopping cart for spanish language
  purchasedSpanishLanguage: boolean = false;
  purchasedSpanishCardToggele: boolean = false;

  //variables used for frequancy
  checkFrequancyId: boolean = false;
  checkCustomFrequancyId: boolean = false;
  CalibrationEnterPrise: number = 1495

  lang: string = 'en';

  // getting reference to date picker
  @ViewChild(MatDatepicker) private rangePicker!: MatDatepicker<Date>;
  @ViewChild('createCoursesToggle') createCoursesToggle!: any;
  @ViewChild('spanishToggle') spanishToggle!: any;

  constructor(
    private service: CrudService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private authService: AuthService,
    public matDialog: MatDialog,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _FileSaverService: FileSaverService,
    private datePipe: DatePipe,
    public translationService: TranslationService,
    public translate: TranslateService,
    private langService: LanguageService
  ) {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });

    this.lang = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';

    let userDetails: any = JSON.parse(localStorage.getItem('userDetails') ?? '');
    if (userDetails && userDetails.languagePreference)
      this.translate.setDefaultLang(userDetails.languagePreference);
  }

  ngOnInit(): void {

    this.switchLanguage();

    this.userInfo = this.authService.getUserInformation();
    let userId = this.userInfo.userId;
    // this.downloadcustomcourcesmatrix();
    this.GetCompanyByUser(userId);
    this.GetTotalLicenses();
    this.loadCompanyDepartmentData();
    this.GetAllCompanyAdmins();
    this.loadCompanyCustomCourseData();
    this.loadCompanyCourseData();
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.lang = lang ?? 'en';
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }


  ngAfterViewInit(): void {
    this.GetAllCompanyUsers();
  }

  //Get User Detail By Id
  GetUserDetailById() {
    this.service
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetUserDetailById +
        '/' +
        this.userInfo.userId
      )
      .then((x: any) => { })
      .catch((x) => { });
  }
  companyData: any = {};
  spanishPurchaseOnandOff: boolean = false
  // get companies by user
  GetCompanyByUser(userId: string) {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyByUser + '/' + userId)
      .then((x: any) => {
        if (x) {
          this.companyOfUser = x;
          this.GetFrequencySelectList();
          this.emailNotifications = x.emailNotifications;
          this.SupervisorEmailNotifications = x.supervisorEmailNotifications;
          this.customCoursesCreator = x.purchasedCustomCourseCreator;
          this.companyId = x.companyID;
          this.lockUserCredentialslock = x.lockUsersCredentials
          this.lockUserProfile = x.lockUsersProfile
          this.spanishPurchaseOnandOff = this.companyOfUser?.purchasedSpanishLanguageCourse
        }
      });

    this.service
      .getAll(
        this.baseUrl + ApiEndpointType.GetCompanyByUserMainPage + '/' + userId
      )
      .then((x: any) => {
        if (x) {
          this.companyData = x;
          // this.companyOfUser = x;
          // this.emailNotifications = x.emailNotifications;
        }
      })
      .catch((y: any) => { });
  }

  //this to load the department  data
  loadCompanyDepartmentData() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyDepartments)
      .then((result: any) => {
        if (result) {
          result.companyDepartmentModelList.forEach((element: any) => {
            element.name = this.langService.simplifyData(
              element.name,
              this.lang
            );
            element.company = this.langService.simplifyData(
              element.company,
              this.lang
            );
          });

          this.dataSource = new MatTableDataSource<CompanyDepartmentModel>(
            result.companyDepartmentModelList
          );
        }
      });
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

  // Get Frequency Select List
  GetFrequencySelectList() {
    this.service
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetFrequencySelectListByCompanyId +
        '?companyId=' +
        this.companyOfUser.companyID
      )
      .then((result: any) => {

        if (result) {
          let addCustom: any = result;
          // addCustom.forEach((element: any) => {
          //   element.text = this.langService.simplifyData(
          //     element.text,
          //     this.languagePreference
          //   );
          // });
          //    addCustom.push({text:'custom',value:5})
          this.frequencyData = addCustom;
        }
      });
  }

  // Get All Company Admins
  GetAllCompanyAdmins() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetAllCompanyAdmins)
      .then((result: any) => {
        if (result) {
          this.dataSourceAdmin = null;
          this.dataSourceAdmin = [...result];
        }
      })
      .catch((x) => { });
  }

  //to Get Company Course Active and InActive Select List
  GetCompanyCourseActiveInActiveSelectList() {
    this.service
      .getAll(
        this.baseUrl + ApiEndpointType.GetCompanyCourseActiveInActiveSelectList
      )
      .then((result: any) => { });
  }

  //to Get All Company Users
  GetAllCompanyUsers() {
    this.service
      .getAll(this.baseUrl + ApiEndpointType.GetAllCompanyUsers)
      .then((result: any) => {
        if (result) {
          this.allCompanyUsers = result;
        }
      });
  }

  //open shopping modal with toggle with custom courses
  updateCompanyByuser(event: any) {
    this.customCoursesCreator = event.checked;
    if (event.checked) {
      this.openShoppingModalToggle = true;
      this.openShoppingModal();
    } else this.openShoppingModalToggle = false;
  }

  //open shopping modal with toggle spanish language
  openModalWithSpanishLanguage(event: any) {
    this.spanishPurchaseOnandOff = true
    this.purchasedSpanishLanguage = event.checked;
    if (event.checked) {
      this.purchasedSpanishCardToggele = true;
      this.openShoppingModal();
    } else this.purchasedSpanishCardToggele = false;
  }

  //this method is used to update name of the company of user
  onBlurMethod(name: string) {
    this.editShow = true;
    if (name == '') return;
    if (this.companyOfUser) this.companyOfUser.name = name;
    this.service
      .post(this.baseUrl + ApiEndpointType.Companies, this.companyOfUser)
      .then((x: any) => {
        this.toastr.success('Record updated successfully.', 'SUCCESS');
      })
      .catch((x) => { });
  }

  enable(): void {
    this.toggleButton = false;
    this.editShowTraining = false;
  }

  openadddepartment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'Add_department';
    dialogConfig.height = '350px';
    dialogConfig.width = '600px';
    // const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
  }

  onBlurTraining(name: string) {
    this.editShowTraining = true;
    if (name == '') return;

    if (this.companyOfUser) this.companyOfUser.trainingMatricFormID = name;
    this.service
      .post(this.baseUrl + ApiEndpointType.Companies, this.companyOfUser)
      .then((x: any) => {
        this.toastr.success('Record updated successfully.', 'SUCCESS');
      })
      .catch((x) => { });
  }

  //this function to delete the departments
  deleteDepartments(val: number) {
    if (val && val > 0) {
      if (confirm('Are you sure you want to delete this Department?'))
        this.service
          .deleteRecord(
            this.baseUrl + ApiEndpointType.CompanyDepartments + '?id=' + val
          )
          .then((x: any) => {
            if (x) {
              this.toastr.success(x.message, 'SUCCESS');
              this.loadCompanyDepartmentData();
            }
          })
          .catch((x) => {
            if (x) this.toastr.error(x.error, 'ERROR');
          });
    }
  }

  //this function to delete the user from admins
  deleteAdminControls(va: any) {
    if (va) {
      if (confirm('Are you sure you want to delete admin?')) {
        if (this.userInfo.userId == va.id) {
          this.toastr.error('Please select any other user.', 'ERROR');
          return;
        }
        this.service
          .post(this.baseUrl + ApiEndpointType.RemoveAdminRights, va)
          .then((x: any) => {
            if (x) {
              this.toastr.success(x.message, 'SUCCESS');
              this.GetAllCompanyAdmins();
            }
          })
          .catch((x) => {
            if (x) this.toastr.error(x.error, 'ERROR');
          });
      }
    }
  }

  //// custom courses /////
  //this function is used to delete custom courses
  deleteCustomCourses(val: any) {
    let message = '';
    if (val != null) {
      this.activeCustomCourses
        ? (message = 'Are you sure you want to delete this record?')
        : (message = 'Are you sure you want to restore this record?');
    }
    if (confirm(message)) {
    }
  }

  //this to get active and inactive custom courses
  onCustomCoursesSelection() {
    this.customCoursesActive === 'Active'
      ? (this.activeCustomCourses = false)
      : (this.activeCustomCourses = true);
    this.loadCompanyCustomCourseData();
  }

  showCreateCourses: boolean = false;
  //this to load the company custom course data
  loadCompanyCustomCourseData() {
    this.service
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetCompanyCustomCourses +
        '/' +
        this.activeCustomCourses
      )
      .then((result: any) => {
        if (result) {
          this.activeCustomCourses
            ? (this.hidetickCustom = true)
            : (this.hidetickCustom = false);
          result.companyCourseModelList.length == 0
            ? (this.showCreateCourses = true)
            : (this.showCreateCourses = false);
          result.companyCourseModelList.forEach((element: any) => {
            element.course = this.langService.convertLangValueObject(element.course);
          });

          this.dataSourceCustomCourses = new MatTableDataSource<any>(
            result.companyCourseModelList
          );
        }
      })
      .catch((x) => { });
  }

  //variable for hide the custom text box
  hideCustomTextBox: number = -1;
  hideCustomTextBoxForCustomCourses: number = -1;
  //update the frequancy of the custom courses
  onCustomCoursesFrequancyChange(val: any, type: string) {
    if (val) {
      let filteredData: any = this.frequencyData.find(
        (x) => x.text === val.frequency
      );
      if (filteredData) {
        val.frequencyID = filteredData.value;
      }
      if (filteredData?.text == 'Custom') {
        this.hideCustomTextBoxForCustomCourses = val.courseID;
        this.hideCustomTextBox = val.courseID;
        return;
      }

      this.saveFrequancyData(type, val);
    }
  }

  saveFrequancyData(type: any, val: any) {
    val.course = this.langService.convertLangValueList(val.course)
    this.service
      .post(this.baseUrl + ApiEndpointType.CompanyCoursesUpdate, val)
      .then((x: any) => {
        if (x) {
          this.GetFrequencySelectList();
          this.hideCustomTextBox = -1;
          this.hideCustomTextBoxForCustomCourses = -1;
          this.toastr.success(x.message, 'SUCCESS');
          this.loadCompanyCourseData();
          this.loadCompanyCustomCourseData();
        }
      })
      .catch((x) => { });
  }

  // update the custom courses due date
  updateCustomCourseDueDate(element: any, val: any, type: string) {
    element.course = this.langService.convertLangValueList(element.course)
    if (val && val > 0) {
      if (element) {
        if (element.dueDateFromStartDate != val)
          element.dueDateFromStartDate = val;
        else return;
      }
      this.service
        .post(this.baseUrl + ApiEndpointType.CompanyCoursesUpdate, element)
        .then((x: any) => {
          if (x) {
            this.toastr.success(x.message, 'SUCCESS');
            if (type === 'custom') this.loadCompanyCustomCourseData();
            else this.loadCompanyCourseData();
          }
        })
        .catch((x) => { });
    }
  }

  //this function is used to delete the company courses
  deleteCompanyCourses(val: any, type: string, courseType: string) {
    if (val && val > 0) {
      let active: boolean = false;
      type === 'delete' ? (active = true) : active;
      active
        ? confirm('Are you sure you want to delete this record?')
        : confirm('Are you sure you want to restore this record?');
      this.service
        .deleteRecord(
          this.baseUrl +
          ApiEndpointType.DeleteCompanyCourses +
          '?id=' +
          val +
          '&isActiveInActive=' +
          active
        )
        .then((x: any) => {
          if (x) {
            active
              ? this.toastr.success(x.message, 'SUCCESS')
              : this.toastr.success(x.message, 'SUCCESS');
            courseType === 'custom'
              ? this.onCustomCoursesSelection()
              : this.onMyexCoursesSelection();
          }
        })
        .catch((x) => { });
    }
  }

  /////my Ex courses/////
  //this function  is to show active and inactive myex courses
  onMyexCoursesSelection() {
    this.myexCoursesActive === 'Active'
      ? (this.activeMyExCourses = false)
      : (this.activeMyExCourses = true);
    this.loadCompanyCourseData();
  }

  //this to load the company course data
  async loadCompanyCourseData() {
    await this.service
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetCompanyCourses +
        '/' +
        this.activeMyExCourses
      )
      .then((result: any) => {
        if (result && result.companyCourseModelList) {
          this.activeMyExCourses
            ? (this.hideTickMyExCourses = true)
            : (this.hideTickMyExCourses = false);
          this.length = result.companyCourseModelList.length;
          result.companyCourseModelList.forEach((element: any) => {
            element.course = this.langService.convertLangValueObject(element.course)
          });
          this.dataSourceMyexCourses =
            new MatTableDataSource<CompanyDepartmentModel>(
              result.companyCourseModelList
            );
          this.dataSourceMyexCourses.paginator = this.paginator;
        }
      });
  }

  //add and update departments
  saveAndUpdateDepartment(val: string) {
    let companyDepartmentModel: CompanyDepartment = new CompanyDepartment();

    if (val == '') {
      this.addDepartments = true;
      return;
    } else {
      this.addDepartments = false;
    }

    if (this.editRecord && this.editDepartmentsCheck)
      companyDepartmentModel.CompanyDepartmentID =
        this.editRecord[0].companyDepartmentID;
    else companyDepartmentModel.CompanyDepartmentID = null;

    companyDepartmentModel.Company = null;
    companyDepartmentModel.CompanyID = this.companyId;
    companyDepartmentModel.Name = val;
    let url: string = '';
    if (this.editDepartmentsCheck)
      url = ApiEndpointType.UpdateCompanyDepartments;
    else url = ApiEndpointType.SaveCompanyDepartments;
    this.service
      .post(this.baseUrl + url, companyDepartmentModel)
      .then((x: any) => {
        if (x) {
          this.toastr.success(x.message, 'SUCCESS');
          this.loadCompanyDepartmentData();
          this.close();
          this.editRecord = null;
          this.editShow = false;
          this.editDepValue = '';
        }
      })
      .catch((x) => {
        if (x) this.toastr.error(x.error, 'ERROR');
      });
  }

  //this function is used to open the department modal
  openDepartmentModal() {
    this.addDepDiv.nativeElement.style.display = 'block';
    this.addDepartments = false;
  }

  //this is used to close the department modal
  close() {
    this.addDepDiv.nativeElement.style.display = 'none';
    this.addDepartments = false;
  }

  //function is to open the admin modal
  openModal() {
    if (this.allCompanyUsers) {
      // let filterData:any = this.allCompanyUsers.filter(x=>x.firstName!=null);
      // filterData = filterData.filter((x:any)=>x.lastname!=null);
      // if(filterData.length==0)
      //  {
      //     this.toastr.info('No active employee to show.');
      //     return;
      //  }
      const dialogRef = this.dialog.open(AdminControlModalComponent, {
        data: this.allCompanyUsers,
      });
      dialogRef.afterClosed().subscribe((x: any) => {
        // let data:any[]= [];
        //    x.forEach((element:any) => {
        //         data.push(this.allCompanyUsers.find(x=>x.email==element.email))
        //    });
        if (x)
          if (x.length > 0)
            this.service
              .post(this.baseUrl + ApiEndpointType.AddCompanyAdmins, x)
              .then((x) => {
                this.toastr.success('Record saved successfully.', 'SUCCESS');
                this.GetAllCompanyAdmins();
                this.changeDetectorRefs.detectChanges();
              })
              .catch((x) => {
                if (x) this.toastr.error(x.error, 'ERROR');
              });
      });
    }
  }

  //function is to open the shopping  modal
  // openShoppingModal() {
  //
  //   const dialogRef = this.dialog.open(ShoppingCartModalComponent, {
  //     data: {
  //       totalNumberOfLincenses: this.totalNumberOfLincenses,
  //       PurchasedCustomCoursesCreator: this.PurchasedCustomCoursesCreator,
  //       PricePerUserTraning: this.PricePerUserTraning,
  //       costPerLicense: this.costPerLicense,
  //       IsCustomCoursesPurchased: this.PurchasedCustomCoursesCreator,
  //       CustomCoursesAndSoftwarePricePerUser:
  //         this.CustomCoursesAndSoftwarePricePerUser,
  //       openShoppingModalToggle: this.openShoppingModalToggle,
  //       purchasedSpanishCardToggele: this.purchasedSpanishCardToggele,
  //       costPerLicenseSpanishLanguage: this.costPerLicenseSpanishLanguage,
  //       GaugeProPrice: this.GaugeProPrice,
  //       SupplierProPrice: this.SupplierProPrice,
  //       MyExCoursesAlternative: this.MyExCoursesAlternative,
  //       MyExCoursesWithoutSpanish: this.MyExCoursesWithoutSpanish,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((x: any) => {
  //     this.spanishToggle.checked = false;
  //     this.createCoursesToggle.checked = false;
  //     this.openShoppingModalToggle = false;
  //     this.purchasedSpanishCardToggele = false;
  //     this.GetTotalLicenses();
  //   });
  // }

  //function is to open the shopping  modal
  openShoppingModal() {

    localStorage.setItem('place', 'report&setting')
    setTimeout(() => {

      if (
        !this.PurchasedCustomCoursesCreator &&
        !this.companyOfUser.purchasedSpanishLanguageCourse
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
            PurchasedSpanishLanguageCourse:
              this.companyData.purchasedSpanishLanguageCourse,
            //purchasedCalibrationEnterprise
            PurchasedCalibrationEnterprise: this.companyData.purchasedCalibrationEnterprise,
            CalibrationEnterPrise: this.CalibrationEnterPrise
          },
        });

        dialogRef.afterClosed().subscribe((x: any) => {
          // this.spanishToggle.checked = false;
          // this.createCoursesToggle.checked = false;
          // this.openShoppingModalToggle = false;
          // this.purchasedSpanishCardToggele = false;
          this.GetCompanyByUser(this.userInfo.userId);
          this.GetTotalLicenses();
          this.spanishPurchaseOnandOff = false
        });
      } else {
        const dialogRef = this.dialog.open(ShoppingCartSeconedComponent, {
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
            PurchasedSpanishLanguageCourse:
              this.companyData.purchasedSpanishLanguageCourse,
            //purchasedCalibrationEnterprise
            PurchasedCalibrationEnterprise: this.companyData.purchasedCalibrationEnterprise,
            CalibrationEnterPrise: this.CalibrationEnterPrise
          },
        });

        dialogRef.afterClosed().subscribe((x: any) => {
          // this.spanishToggle.checked = false;
          // this.createCoursesToggle.checked = false;
          // this.openShoppingModalToggle = false;
          // this.purchasedSpanishCardToggele = false;
          this.GetCompanyByUser(this.userInfo.userId);

          this.GetTotalLicenses();
        });
      }
    }, 1500);
  }
  //this function is used to edit the departments
  editDepartments(val: any) {
    this.editDepartmentsCheck = true;
    this.editRecord = this.dataSource.data.filter(
      (x) => x.companyDepartmentID == val
    );
    this.editDepValue = this.editRecord[0].name;
    this.openDepartmentModal();
  }

  //this function is used to download the custom and myex courses matrix
  downloadcustomcourcesmatrix(val: string) {
    let isCustomCourse: boolean;
    if (val == 'custom') isCustomCourse = true;
    else isCustomCourse = false;
    this.service
      .getBlobSingleWithParams(
        `${this.baseUrl +
        ApiEndpointType.DownloadCompanyAdminUserCourseTraningMatrixReport
        }/${isCustomCourse}`
      )
      .then((x: any) => {

        let date = new Date();
        let name =
          'Training_Matrix_' +
          this.datePipe.transform(date, 'M-dd-yy') +
          '.PDF';
        this._FileSaverService.save(x, name);
      })
      .catch((x) => { });
  }

  //to edit the name
  onNameEdit() {
    this.editShow = false;
    this.button.nativeElement.disabled = false;
    this.accountName = true;
  }

  //to get the selected year after selection and gets its last and first date
  chosenYearHandler(ev: any, input: any) {
    this.selectYear = new Date(ev).getFullYear();
    this.firstDateOfYear = new Date(this.selectYear, 0, 1);
    this.lastDateOfYear = new Date(this.selectYear + 1, 0, 0);
    this.rangePicker.close();
  }

  //this function is used to download the amyaward report
  downloadamtawardsreport(/*StartDate,EndDate*/) {
    this.service
      .getBlobSingleWithParams(
        `${this.baseUrl + ApiEndpointType.DownloadCompanyAdminUserAMTAwardsReport
        }/${this.firstDateOfYear.toDateString()}/${this.lastDateOfYear.toDateString()}`
      )
      .then((x) => {
        let name =
          'EX_AMT_AWARDS_' +
          this.firstDateOfYear.toDateString() +
          '_To_' +
          this.lastDateOfYear.toDateString() +
          '.PDF';
        this._FileSaverService.save(x, name);
      });
  }

  //to save frequancyId
  saveCustomFrequancy(val: any, type: string) {
    if (type == '') {
      this.checkFrequancyId = true;
      return;
    } else this.checkFrequancyId = false;

    if (type) {
      let filteredData: any = this.frequencyData.find(
        (x) => x.text == 'Custom'
      );
      if (filteredData) {
        val.monthsCount = type;
        val.frequancyId = filteredData.frequancyId;
        val.frequency = type + ' months';
      }
      this.saveFrequancyData(type, val);
    }
  }

  sendMailToSuperVisor(event: any) {
    if (this.companyOfUser)
      this.companyOfUser.supervisorEmailNotifications = event.checked;
    this.service
      .post(this.baseUrl + ApiEndpointType.Companies, this.companyOfUser)
      .then((x: any) => {
        this.toastr.success('Record updated successfully.', 'SUCCESS');
      })
      .catch((x) => { });
  }

  //to enable and disable the email notification
  updateEmailCompanyByuser(event: any) {
    if (this.companyOfUser)
      this.companyOfUser.emailNotifications = event.checked;
    this.service
      .post(this.baseUrl + ApiEndpointType.Companies, this.companyOfUser)
      .then((x: any) => {
        this.toastr.success('Record updated successfully.', 'SUCCESS');
      })
      .catch((x) => { });
  }

  //lock user credentials
  lockUserCredentials(val: any) {

    if (val) {
      this.service
        .getAll(`${this.baseUrl + ApiEndpointType.lockUserCredentialsAndProfile}/${val.checked}/${'credentials'}`)
        .then((x: any) => {
          if (x) {
            this.toastr.success(x.message, 'SUCCESS')
          }
        })
        .catch((x) => { });
    }
  }
  lockUserProfile: boolean = false
  lockUserCredentialslock: boolean = false
  //Lock user profiles
  lockUserProfiles(val: any) {

    if (val) {
      this.service
        .getAll(`${this.baseUrl + ApiEndpointType.lockUserCredentialsAndProfile}/${val.checked}/${'profile'}`)
        .then((x: any) => {
          if (x) {
            this.toastr.success(x.message, 'SUCCESS')
          }
        })
        .catch((x) => { });
    }
  }
}

//this is used to format the datetime picker to month only
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};
