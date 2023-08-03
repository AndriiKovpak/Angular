import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/guards/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { gaugeStatus } from './Model/GaugeStatusList.model';
import { company } from '../reports-settings/models/company.model';
import { MatSort, Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdminUsersAddComponent } from '../../core/modal/admin-users-add/admin-users-add.component';
import { ExcelService } from '../../core/excel/excel.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ShoppingCartModalComponent } from '../../core/modal/shopping-cart-modal/shopping-cart-modal.component';
import { ShoppingCartSeconedComponent } from '../../core/modal/shopping-cart-seconed/shopping-cart-seconed.component';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calibration-reports-settings',
  templateUrl: './calibration-reports-settings.component.html',
  styleUrls: ['./calibration-reports-settings.component.scss'],
})
export class CalibrationReportsSettingsComponent
  implements OnInit, AfterViewInit
{
  DataManagementForm!: FormGroup;

  // ActiveUsers:true
  ActiveUsers: string = 'Active';
  InActiveUsers: string = 'InActive';
  hideTickUsers: boolean = false;
  ChangeActiveUsers: boolean = false;
  companyId: number = 0;
  companyOfUser: company = new company();
  StatusReport!: FormGroup;
  baseUrl: string = environment.apiBase;
  //baseUrl1:string=environment.apiBase1;
  statusList: any[] = [];
  standardList: any;
  userInfo: any;
  ManufacturerList: any;
  AccountPrivillegesDeleteUser: any;
  OwnerList: any;
  editRecord: any;
  editRecordOwner: any;
  editRecordStandard: any;
  editRecordmnf: any;
  editRecordLocation: any;
  LocationList: any;
  gridApi: any;
  gridColumnApi: any;
  PrivillegesUsersData: any;
  frameworkComponents: any;
  deletedata: any;
  editValue: any;
  editValueStandard: any;
  editValueOwner: any;
  editValuemnf: any;
  editValueLocation: any;
  editGaugeOwnerCheck: boolean = false;
  editGaugemnfCheck: boolean = false;
  editGaugeStatusCheck: boolean = false;
  editGaugeLocationCheck: boolean = false;
  addManufacturer: boolean = false;
  addLoc: Boolean = false;
  editPrivilageUserId: any;
  editPrivilageUserFirstName: any;
  editPrivilageUserLastName: any;
  editPrivilageUserEmail: any;
  editShow: boolean = true;
  emailNotifications: boolean = false;
  accountName: boolean = false;
  CompanynameforUser: any;
  AccountPrivilageActive: string = 'Active';
  ActiveAccountPrivilage: boolean = false;
  rowData: any[] = [];
  addStatus: boolean = false;
  addStd: boolean = false;
  addOwn: boolean = false;
  historyData: any;
  EditAccountPrivilageForm!: FormGroup;
  @ViewChild('addDepDiv') addDepDiv!: ElementRef;
  @ViewChild('addstdDiv') addstdDiv!: ElementRef;
  @ViewChild('addOwnDiv') addOwnDiv!: ElementRef;
  @ViewChild('addOwnDivupd') addOwnDivupd!: ElementRef;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('addmnfDiv') addmnfDiv!: ElementRef;
  @ViewChild('addLocDiv') addLocDiv!: ElementRef;
  @ViewChild('addLocDivUpd') addLocDivUpd!: ElementRef;
  @ViewChild('addSupplier') addSupplier!: ElementRef;
  @ViewChild('mnfDivadd') mnfDivadd!: ElementRef;
  @ViewChild('AddstandardModal') AddstandardModal!: ElementRef;
  @ViewChild('saveStandardInput') saveStandardInput!: ElementRef;
  @ViewChild('CompanyName') button: any;
  @ViewChild('EditPrivilegesDetails') EditPrivilegesDetails!: ElementRef;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('historyTableTitle', { static: false }) historyTableTitle!: ElementRef;
  @ViewChild('guagesTitle', { static: false }) guagesTitle!: ElementRef;
  pageIndex: number = 0;
  pageSize: number = 10;
  gaugeHistoryPageIndex: number = 0;
  gaugeHistoryPageSize: number = 10;
  gaugeHistorySort: any = null;
  count: number = 5;
  activePage: number = 0;
  length: number = 2;
  gaugeHistoryLength: number = 2;
  paginationArray: number[] = [5];
  customCoursesActive: string = 'Active';
  fequancyValue: any = 1;
  dataSource = new MatTableDataSource();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  Historyrange = new FormGroup({
    Historystart: new FormControl(),
    Historyend: new FormControl(),
  });
  years: any[] = [];
  selectedYears!: any[];
  columnsToDisplay = [
    'fullName',
    'email',
    'Invite',
    'Edit',
    'Admin',
    'Supplier',
    'Read',
    'Delete',
  ];

  constructor(
    private formBuilder: FormBuilder,
    public dataService: CrudService,
    private toastr: ToastrService,
    private authService: AuthService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private router: Router,
    public translate: TranslateService,
    public translationService: TranslationService
  ) {

  }

  ngOnInit(): void {
    this.switchLanguage();

    this.FormInitialize();
    this.initializeFormAccoutPrivilage();
    this.updateUserInfo();
    this.getSupplierList();
    this.lastRecordOfGauge();
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }

  sortChange(sortState: Sort) {
    this.gaugeHistorySort = sortState;
    this.getGetInfoGaugeRecords();
  }

  updateUserInfo() {
    this.dataService
      .getAll(this.baseUrl + '/api/Authorize/user')
      .then((res: any) => {
        localStorage.removeItem('userDetails');
        localStorage.setItem('userDetails', JSON.stringify(res));
        this.userInfo = this.authService.getUserInformation();
        let userId = this.userInfo.userId;
        this.auth();
        this.GetCompanyByUser(userId);
        this.GetStatusReportSelectList();
        this.GetStandartList();
        this.GetOwnerList();
        //    this.getGaugeHistory(49);
        this.GetLocationList();
        this.GetManufacturerList();
        // this.GetSupplierList();
        this.getAccountPrivillegesUsers();
        this.getGetInfoGaugeRecords();
        this.GetTotalLicenses();
        this.getSupplierListWithoutUser();
      });
  }
  auth() {
    if (
      this.userInfo.role.split(',').filter((x: any) => x == 'Supplier')[0] ==
        'Supplier' &&
      this.userInfo.role.split(',').filter((x: any) => x == 'Read')[0] == 'Read'
    ) {
      this.router.navigate(['/companyadmin/gauge-records']);
      return;
    }
    if (
      this.userInfo.role.split(',').filter((x: any) => x == 'Supplier')[0] ==
      'Supplier'
    ) {
      this.router.navigate(['/companyadmin/gauge-records']);
      return;
    }
    if(this.userInfo.role.split(',').filter((x:any )=> x == 'Read')[0] ==
    'Read'){
      this.router.navigate(['/companyadmin/gauge-records']);
      return;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceHistory.paginator = this.paginator2;
  }

  supplierSelected: any[] = [];
  selectAll(checkAll: any, select: any, values: any) {
    //this.toCheck = !this.toCheck;
    // if (checkAll)
    //   select.update.emit(values);
    // } else {
    //   select.update.emit([]);
    // }
    if (this.selectedYears.length > 0) this.AddSupplier();
  }
  AddSupplier() {
    this.selectedYears.forEach((element: any) => {
      let data: any = {
        SupplierId: element,
      };
      this.supplierSelected.push(data);
      data = {};
    });
    this.dataService
      .post(this.baseUrl + ApiEndpointType.AddSupplier, this.selectedYears)
      .then((x: any) => {
        if (x) this.toastr.success(x.message, 'SUCCESS');
        this.getAccountPrivillegesUsers();
      })
      .catch((x) => {
        if (x) this.toastr.error(x.error, 'ERROR');
      });
    this.closeaddSupplier();
  }
  reset() {
    this.saveStandardInput.nativeElement = '';
  }
  FormInitialize() {
    this.DataManagementForm = this.formBuilder.group({
      GaugeStatus: new FormControl('', [Validators.required]),
      Standard: new FormControl('', [Validators.required]),
      Owner: new FormControl('', [Validators.required]),
      Manufacturer: new FormControl('', [Validators.required]),
      Location: new FormControl('', [Validators.required]),
    });

    this.StatusReport = this.formBuilder.group({
      StandardReport: new FormControl('', [Validators.required]),
      ReportReview: new FormControl('', [Validators.required]),
      //Standard: new FormControl("",[Validators.required]),
    });

    this.EditAccountPrivilageForm = this.formBuilder.group({
      Fname: new FormControl('', [Validators.required]),
      Lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }
  get f() {
    return this.DataManagementForm.controls;
  }
  get g() {
    return this.StatusReport.controls;
  }
  get a() {
    return this.EditAccountPrivilageForm.controls;
  }

  initializeFormAccoutPrivilage() {
    this.EditAccountPrivilageForm = this.formBuilder.group({
      Fname: new FormControl('', [Validators.required]),
      Lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }

  //This is used to load the Gauge Status DropDown list
  GetStatusReportSelectList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetGaugeStatusList)
      .then((x: any) => {
        this.statusList = [];
        this.statusList = x;
      });
  }
  selectedValue: number = 0;
  selectedValueArray: number[] = [];
  changeWebsite(val: any) {
    if (val.value) {
      this.selectedValueArray = [];
      this.selectedValue = 0;
      val.value.forEach((element: any) => {
        this.selectedValueArray.push(element);
      });
      // this.GetGaugeLists(val.target.value);
      this.getListofGaugeAccordingStatusWithMultipleSelect();
    }
  }

  getGaugeStatus: any[] = [];
  getGaugeStatuss:any[] = [];
  GetGaugeListsWithDate(value: number[], start: any, end: any) {

    let data: any = {
      StatusValue: [],
      StartDate: new Date(),
      EndDate: new Date(),
    };
    data.StatusValue = this.selectedValueArray;
    data.StartDate = start;
    data.EndDate = end;

    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.GetListofGaugeAccordingStatusWithDate,
        data
      )
      .then((x: any) => {
        this.getGaugeStatuss = [];
        this.getGaugeStatuss = x;
        this.dataSourceHistory2 = new MatTableDataSource<any>(
          this.getGaugeStatuss
        );
      });
  }
  getListofGaugeAccordingStatusWithMultipleSelect() {
    this.dataService
      .post(
        `${
          this.baseUrl +
          ApiEndpointType.getListofGaugeAccordingStatusWithMultipleSelect
        }`,
        this.selectedValueArray
      )
      .then((x: any) => {
        this.getGaugeStatus = [];
        this.getGaugeStatus = x;
        this.dataOfGaugeStatusReport = this.getGaugeStatus;
        this.dataSourceHistory2 = new MatTableDataSource<any>(
          this.getGaugeStatus
        );
      })
      .catch((x) => {});
  }
  GetGaugeLists(value: number) {
    this.dataService
      .getAll(
        `${
          this.baseUrl + ApiEndpointType.GetListofGaugeAccordingStatus
        }/${value}`
      )
      .then((x: any) => {
        this.getGaugeStatus = [];
        this.getGaugeStatus = x;
      })
      .catch((x) => {});
  }

  pdfBoolean: boolean = false;
  excelBoolean: boolean = false;
  downloadFile() {
    this.excelBoolean = false;
    this.pdfBoolean = true;
    this.toastr.info('PDF type is selected');
  }
  downloadExeFile() {
    this.excelBoolean = true;
    this.pdfBoolean = false;
    this.toastr.info('Excel type is selected');
  }
  hideStatusReportTab: boolean = false;
  runReport(tableId: string) {

    if (this.selectedValueArray.length == 0) {
      this.toastr.info('Please select the status type');
      return;
    }

    if (!this.excelBoolean && !this.pdfBoolean) {
      this.toastr.info('Please select the document type');
      return;
    }

    if (this.getGaugeStatus.length == 0) {
      this.toastr.info('No data found.');
      return;
    }

    if (this.excelBoolean) {
      if(this.dateRangeStatusForStatus == false){
        this.excelService.downloadExcelFile(
          this.createData(this.getGaugeStatus),
          'StatusReport'
        );
      }
      else{
        this.excelService.downloadExcelFile(
          this.createData(this.getGaugeStatuss),
          'StatusReport'
        );
      }
    } else {
      this.hideStatusReportTab = true;
      setTimeout(() => {
        //let data: any = document.getElementById('contentToConvert2');
        //this.excelService.downloadpdf(data, 'StatusReport');
        this.excelService.downloadPDF(tableId, 85, 'StatusReport', 'Status Report');
        this.hideStatusReportTab = false;
      }, 1000);
    }
  }

  endChange(event: any) {
    if (this.selectedValueArray.length == 0)
      this.toastr.info('Please select the status.');
    if (this.range.value.end && this.range.value.start) {
      // let data :any={
      //   status:this.selectedValueArray,
      //   startDate : new Date(this.range.value.start),
      //   endDate : new Date(this.range.value.end),

      // }
      this.GetGaugeListsWithDate(
        this.selectedValueArray,
        new Date(this.range.value.start),
        new Date(this.range.value.end)
      );
    }
  }

  //This is used to load the Standard DropDown list
  GetStandartList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetStandardSelectList)
      .then((x) => {
        this.standardList = x;
      });
  }
  //This is used to load the Owner DropDown list
  GetOwnerList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetOwnerSelectList)
      .then((x) => {
        this.OwnerList = x;
      });
  }
  //This is used to load the Manufacturer DropDown list
  GetManufacturerList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetManufacturerSelectList)
      .then((x) => {
        this.ManufacturerList = x;
      });
  }
  //This is used to load the Location DropDown list
  GetLocationList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetLocationSelectList)
      .then((x) => {
        this.LocationList = x;
      });
  }

  //This is used to delete records from Gauge Status DropdownList

  deleteGaugeStatus(val: number) {
    if (confirm('Are you sure you want to delete this Gauge Status?'))
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.GaugeStatusDelete}/${val}`
        )
        .then((x: any) => {
          if (x) this.toastr.success(x.message, 'SUCCESS');
          this.GetStatusReportSelectList();
        })
        .catch((x: any) => {
          this.toastr.error(x.error, 'ERROR');
        });
  }

  //This is used to delete records from Gauge Standard DropdownList
  deleteGaugeStandard(val: number) {
    if (confirm('Are you sure you want to delete this Gauge Standard?'))
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.GaugeStandardDelete}/${val}`
        )
        .then((x: any) => {
          if (x) this.toastr.success(x.message, 'SUCCESS');

          this.GetStandartList();
        })
        .catch((x: any) => {
          this.toastr.error(x.error, 'ERROR');
        });
  }

  //To delete Owner List fields
  deleteGaugeOwner(val: number) {
    if (confirm('Are you sure you want to delete this Gauge Owner?'))
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.GaugeOwnerDelete}/${val}`
        )
        .then((x: any) => {
          if (x) this.toastr.success(x.message, 'SUCCESS');
          this.GetOwnerList();
        })
        .catch((x: any) => {
          this.toastr.error(x.error, 'ERROR');
        });
  }

  //To delete Manufacturer List fields
  deleteGaugeManufacturer(val: number) {
    if (confirm('Are you sure you want to delete this Gauge Manufacturer?')) {
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.GaugeManufactureDelete}/${val}`
        )
        .then((x: any) => {
          if (x) this.toastr.success(x.message, 'SUCCESS');
          this.GetManufacturerList();
        })
        .catch((x: any) => {
          this.toastr.error(x.error, 'ERROR');
        });
    }
  }

  //To delete Location List fields
  deleteGaugeLocation(val: number) {
    if (confirm('Are you sure you want to delete this Gauge Location ?'))
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.GaugeLocationDelete}/${val}`
        )
        .then((x: any) => {
          if (x) this.toastr.success(x.message, 'SUCCESS');
          this.GetLocationList();
        })
        .catch((x: any) => {
          this.toastr.error(x.error, 'ERROR');
        });
  }

  OpenAddManufacturerModal() {
    this.mnfDivadd.nativeElement.style.display = 'block';
  }

  gaugeStatusItem: any;
  openGaugeStatusModal() {
    this.editValue = '';
    this.editGaugeStatusCheck = false;
    this.addDepDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }
  openGaugeStatusModalForEdit() {
    this.addDepDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }

  openModalStandard() {
    this.addstdDiv.nativeElement.style.display = 'block';
    this.addStd = false;
  }
  openModalmnf() {
    this.addmnfDiv.nativeElement.style.display = 'block';
  }

  openModalLocation() {
    this.addLocDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
  }

  openModalOwner() {
    this.addOwnDiv.nativeElement.style.display = 'block';
    //this.addStatus = false;
    this.addOwn = false;
  }

  openModalOwnerforUpdate() {
    this.addOwnDivupd.nativeElement.style.display = 'block';
    this.addOwn = false;
  }

  OpenStandardModal() {
    this.AddstandardModal.nativeElement.style.display = 'block';
  }

  openModalLocationforAdd() {
    this.addLocDivUpd.nativeElement.style.display = 'block';
  }

  openModaladdSupplier() {
    this.addSupplier.nativeElement.style.display = 'block';
  }

  //Modal for Account Privilages Edit Details
  openEditPrivilegesDetailsModal() {
    this.EditPrivilegesDetails.nativeElement.style.display = 'block';
  }
  // addSupplier
  closeaddSupplier() {
    this.addSupplier.nativeElement.style.display = 'none';
  }

  closeLocationAdd() {
    this.addLocDivUpd.nativeElement.style.display = 'none';
    this.addLoc = false;
  }
  closeOwner() {
    this.addOwnDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }
  closeStandardAdd() {
    this.AddstandardModal.nativeElement.style.display = 'none';
  }

  closeManufacturerModal() {
    this.mnfDivadd.nativeElement.style.display = 'none';
    this.addManufacturer = false;
  }

  closeOwnerAdd() {
    this.addOwnDivupd.nativeElement.style.display = 'none';
    this.addStatus = false;
  }

  //Close manufacturer Modal
  closemnf() {
    this.addmnfDiv.nativeElement.style.display = 'none';
  }

  //Close Location Modal
  closeLocaton() {
    this.addLocDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }

  //To close Gauge Status Modal
  close() {
    this.addDepDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }

  //To close the standard modal

  closeStandard() {
    this.addstdDiv.nativeElement.style.display = 'none';
    this.addStatus = false;
  }

  //To Close Edit Account Privilages Modal
  CloseEditPrivilegesDetailsModal() {
    this.EditPrivilegesDetails.nativeElement.style.display = 'none';
  }
  //this function is used to edit the Owner

  editOwner(val: any) {
    this.editGaugeOwnerCheck = true;
    this.editRecordOwner = this.OwnerList.filter((x: any) => x.id == val);
    this.editValueOwner = this.editRecordOwner[0].name;
    this.openModalOwner();
  }
  editValueSupplier: any;
  supplierUpdateId: any = 0;
  editSupplier(val: any) {
    this.supplierUpdateId = val;

    this.editValueSupplier = this.getSupplierListWithoutUserList.find(
      (x: any) => x.id == val
    ).name;
    this.openModaladdSupplier();
  }

  //To Edit Location

  editLocation(val: any) {
    this.editGaugeLocationCheck = true;
    this.editRecordLocation = this.LocationList.filter((x: any) => x.id == val);

    this.editValueLocation = this.editRecordLocation[0].name;
    this.openModalLocation();
  }

  // To edit Manufaturer

  editmnf(val: any) {
    this.editGaugemnfCheck = true;
    this.editRecordmnf = this.ManufacturerList.filter((x: any) => x.id == val);
    this.editValuemnf = this.editRecordmnf[0].name;
    this.openModalmnf();
  }

  //To delete Account Privilige User
  DeleteUser(val: any) {
    let username: any;
    username = val.fullName;
    this.AccountPrivillegesDeleteUser = val.id;
    if (confirm('Are you sure you want to delete' + ' ' + username))
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.DeleteAccoutPrivillegesUsers}/${
            this.AccountPrivillegesDeleteUser
          }`
        )
        .then((x: any) => {
          if (x && x.message) this.toastr.success(x.message, 'SUCCESS');
          this.getAccountPrivillegesUsers();
        })
        .catch((x: any) => {});
  }
  //To recover Account Privilige User
  RecoverUser(val: any) {
    let username: any;
    username = val.fullName;
    this.AccountPrivillegesDeleteUser = val.id;
    if (confirm('Are you sure you want to recover' + ' ' + username))
      this.dataService
        .deleteRecord(
          `${this.baseUrl + ApiEndpointType.RecoverUser}/${
            this.AccountPrivillegesDeleteUser
          }`
        )
        .then((x: any) => {
          if (x && x.message) this.toastr.success(x.message, 'SUCCESS');
          this.getAccountPrivillegesUsers();
        })
        .catch((x: any) => {});
  }
  //To Edit Account Privilige User
  editUser(val: any) {
    //this.editPrivilageUser=this.ac
    this.editPrivilageUserFirstName = val.firstName;
    this.editPrivilageUserLastName = val.lastName;
    this.editPrivilageUserEmail = val.email;
    this.editPrivilageUserId = val.id;
    this.openEditPrivilegesDetailsModal();
  }

  //this function is used to edit the Status
  editStatus(val: any) {
    this.editGaugeStatusCheck = true;
    this.editRecord = this.statusList.filter((x: any) => x.id == val);
    this.editValue = this.editRecord[0].name;
    this.openGaugeStatusModalForEdit();
  }

  //this function is used to edit the Standard
  editStandard(val: any) {
    this.editRecordStandard = this.standardList.filter((x: any) => x.id == val);
    this.editValueStandard = this.editRecordStandard[0].name;
    this.openModalStandard();
  }

  //Function To Update the Standard Field Value
  UpdateGaugeStandardField(val: string) {
    this.editRecordStandard[0].name = this.editValueStandard;
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.GaugeStandardUpdate,
        this.editRecordStandard[0]
      )
      .then((x) => {
        this.toastr.success('Record Updated successfully.', 'SUCCESS');
        this.GetStandartList();
      })
      .catch();
    this.closeStandard();
  }

  //Function to Update the Location List
  UpdateGaugeLocationField(val: string) {
    this.editRecordLocation[0].name = this.editValueLocation;
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.GaugeLocationUpdate,
        this.editRecordLocation[0]
      )
      .then((x) => {
        this.toastr.success('Record Updated successfully.', 'SUCCESS');
        this.GetLocationList();
      })
      .catch();
    this.closeLocaton();
  }

  //Function To Update the Manufacturer Field Value

  UpdateGaugemnfField(val: string) {
    this.editRecordmnf[0].name = this.editValuemnf;
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.GaugemnfUpdate,
        this.editRecordmnf[0]
      )
      .then()
      .catch();
    this.closemnf();
  }

  //Function to Update the Owner Field Value
  UpdateGaugeOwnerField(val: String) {
    this.editRecordOwner[0].name = this.editValueOwner;
    this.dataService
      .post(
        this.baseUrl + ApiEndpointType.GaugeOwnerUpdate,
        this.editRecordOwner[0]
      )
      .then((x: any) => {
        this.toastr.success('Record Updated successfully.', 'SUCCESS');
        this.GetOwnerList();
      })
      .catch();
    this.closeOwner();
  }

  //to add Manufacturer Field
  AddManufacturerField(val: string) {
    if (val == '') {
      this.addManufacturer = true;
      return;
    } else this.addManufacturer = false;
    let ManufaturerModel: gaugeStatus = new gaugeStatus();
    ManufaturerModel.name = val;
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = 0;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugemnfUpdate, data)
      .then((x: any) => {
        this.toastr.success('Record added successfully.', 'SUCCESS');
        this.GetManufacturerList();
      })
      .catch();
    this.closeManufacturerModal();
  }

  //Function to Add Gauge Location Field
  addLocationField(val: string) {
    if (val == '') {
      this.addLoc = true;
      return;
    } else this.addLoc = false;

    let GaugeStatusModel: gaugeStatus = new gaugeStatus();
    GaugeStatusModel.name = val;
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = 0;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeLocationUpdate, data)
      .then((x: any) => {
        this.toastr.success('Record added successfully.', 'SUCCESS');
        this.GetLocationList();
      })
      .catch();
    this.closeLocationAdd();
  }

  //Function to add Gauge Standard Field
  AddGaugeStandardField(val: string) {
    if (val == '') {
      this.addStd = true;
      return;
    } else this.addStd = false;
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = 0;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeStandardUpdate, data)
      .then((x: any) => {
        this.toastr.success('Record added successfully.', 'SUCCESS');
        this.GetStandartList();
      })
      .catch();
    // this.saveStandardInput.Value="";
    this.closeStandardAdd();
  }

  //Function to update and add the Gauge Status Field Value
  UpdateGaugeStatusField(val: string) {
    let GaugeStatusModel: gaugeStatus = new gaugeStatus();
    if (val == '') {
      this.addStatus = true;
      return;
    } else {
      this.addStatus = false;
    }

    if (this.editRecord && this.editGaugeStatusCheck) {
      GaugeStatusModel.id = this.editRecord[0].id;
      this.editRecord[0].name = this.editValue;
    } else {
      //GaugeStatusModel.id = 0;
      GaugeStatusModel.name = val;
    }
    let data: any = {
      id: this.editGaugeStatusCheck ? this.editRecord[0].id : 0,
      name: '',
    };
    //  data.id = 0
    data.name = val;
    // this.editRecord[0].name = this.editValue
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeStatusUpdate, data)
      .then((x: any) => {
        if (x) {
          this.toastr.success('Record Updated successfully.', 'SUCCESS');
          this.close();
          this.editRecord = null;
          this.GetStatusReportSelectList();
        }
      })
      .catch((x) => {
        if (x) this.toastr.error(x.error, 'ERROR');
      });
  }

  //Function to Populate Gauge History Table
  getGaugeHistory(Id: number) {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.GetGaugeHistory}/${Id}`)
      .then((x) => {
        this.historyData = x;
      })
      .catch();
  }

  //this function  is to show active and inactive myex courses
  onUsersSelection() {
    this.ActiveUsers == 'Active' ? (this.active = true) : (this.active = false);
    this.getAccountPrivillegesUsers();
  }

  // TO POPULATE ACCOUNT PRIVILEGES TABLE
  active: boolean = true;
  getAccountPrivillegesUsers() {
    let paging: any = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.dataService
      .post(
        `${this.baseUrl + ApiEndpointType.GetAllUserswithPagingCalibration}/${
          this.active
        }`,
        paging
      )
      .then((x: any) => {
        this.PrivillegesUsersData = x;
        if (this.PrivillegesUsersData.userModelList) {
          this.dataSource.data = [];
          this.years = [];

          this.dataSource = new MatTableDataSource<any>(
            this.PrivillegesUsersData.userModelList
          );
          this.dataSource.data.forEach((element: any) => {
            this.years.push({
              fullName: element.fullName,
              id: element.id,
            });
          });
          this.length = x.count;
          this.count = Number(this.PrivillegesUsersData.count);
          if (this.count <= 10) this.paginationArray = [10];
          else if (this.count <= 25) this.paginationArray = [10, 25];
          else if (this.count <= 50) this.paginationArray = [10, 25, 50];
          else if (this.count <= 100) this.paginationArray = [10, 25, 50, 100];
          else if (this.count > 100)
            this.paginationArray = [10, 25, 50, 100, this.count];
        }
      })
      .catch();
  }

  public getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    // if (this.pageIndex == 0) this.pageIndex = 1;
    this.pageSize = event.pageSize;
    this.getAccountPrivillegesUsers();
  }

  public getGaugeHistoryServerData(event: PageEvent) {
    this.gaugeHistoryPageIndex = event.pageIndex;
    this.gaugeHistoryPageSize = event.pageSize;
    this.getGetInfoGaugeRecords();
  }

  onBlurMethod(name: string) {
    this.editShow = true;
    if (name == '') return;
    if (this.companyOfUser) this.companyOfUser.name = name;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.Companies, this.companyOfUser)
      .then((x: any) => {
        this.toastr.success('Record updated successfully.', 'SUCCESS');
        this.button.nativeElement.disabled = true;
      })
      .catch((x) => {});
  }

  // get companies by user
  GetCompanyByUser(userId: string) {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanyByUser + '/' + userId)
      .then((x: any) => {
        if (x) {
          this.companyOfUser = x;
          //this.fequancyValue = x.emailFreqauncy;
          if (x.emailFreqauncy)
            switch (x.emailFreqauncy) {
              case 'Weekly':
                this.fequancyValue = 1;
                break;
              case 'Biweekly':
                this.fequancyValue = 2;
                break;
              case 'Monthly':
                this.fequancyValue = 3;
                break;
              case 'Quarterly':
                this.fequancyValue = 4;
                break;
              default:
                this.fequancyValue = 1;
                break;
            }
          //  this.companyData = x
          this.emailNotifications = x.emailNotifications;
        }
      })
      .catch((y: any) => {
        this.button.nativeElement.disabled = true;
      });
    this.dataService
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
      .catch((y: any) => {});
  }
  //To Edit The Name
  onNameEdit() {
    this.editShow = false;
    this.button.nativeElement.disabled = false;
    // this.accountName=true;
  }

  // FUNCTION TO SAVE ACCOUNT PRIVILLAGE TABLE EDIT DATA

  onSubmit(form: any) {
    let data = form.value;
    data.id = this.editPrivilageUserId;
    data.firstName = this.editPrivilageUserFirstName;
    data.lastName = this.editPrivilageUserLastName;
    data.email = this.editPrivilageUserEmail;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.AccoutPrivillegesUsersUpdate, data)
      .then((x: any) => {
        this.toastr.success(x.message, 'SUCCESS');
        this.getAccountPrivillegesUsers();
      })
      .catch((x: any) => this.toastr.error(x.error, 'ERROR'));
    this.CloseEditPrivilegesDetailsModal();
  }

  updateEmailCompanyByuser(event: any) {
    if (this.companyOfUser) {
      this.companyOfUser.emailNotifications = event.checked;
    }
    this.dataService
      .post(this.baseUrl + ApiEndpointType.Companies, this.companyOfUser)
      .then((x: any) => {
        // this.toastr.success('Record updated successfully.', 'SUCCESS');
      })
      .catch((x) => {});
  }

  // started the work done by me
  selectedRow!: Number;
  gaugeData: any;
  GaugeID: any;
  updateDate: any;
  calibrationDate: any;
  StatusOfGauge: any;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('GaugeDetails') GaugeDetails!: ElementRef;
  @ViewChild('filter', { static: false }) filter!: ElementRef;
  dataSourceHistory = new MatTableDataSource();
  dataSourceHistory2 = new MatTableDataSource();
  dataOfGaugeStatusReport: any;
  columnsToDisplayHistory = ['updatedDate', 'userId', 'gaugeId', 'actions'];

  columnsToDisplayHistoryStatus = [
    'Due_Date',
    'Gauge_ID',
    'S_N',
    'Status',
    'Last_Calibrated',
    'Gauge_Location',
    'Description',
    'Supplier',

  ];

  openModal(val: any) {
    this.GaugeDetails.nativeElement.style.display = 'block';
    this.GaugeID = val.gaugeId;
    this.updateDate = val.updatedDate;
    this.calibrationDate = val.calibrationDate;
    this.StatusOfGauge = val.gaugeStatus;
  }

  CloseModal() {
    this.GaugeDetails.nativeElement.style.display = 'none';
    //this.GaugeDetails.nativeElement.style.display = 'none';
  }
  //filters of individual  columns
  // applyFilter(filterValue: any) {
  //
  //   this.dataSourceHistory.filter = filterValue.trim().toLocaleLowerCase();

  //   //this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  applyFilter(event: any) {
    const filterValue = event;
    this.dataSourceHistory.filter = filterValue.trim().toLowerCase();
  }
  paginationArray2: number[] = [];

  getGetInfoGaugeRecords() {

    let paging: any = {
      pageIndex: this.gaugeHistoryPageIndex,
      pageSize: this.gaugeHistoryPageSize,
      sort: this.gaugeHistorySort
    };

    this.dataService
      .post(`${this.baseUrl + ApiEndpointType.GetGaugeLogs}`, paging)
      .then((x: any) => {
        this.data = [];
        this.gaugeData = x.gaugeLogModelList;

        this.gaugeData.forEach((element: any) => {
          element['createdDate'] = this.datepipe.transform(
            element.createdDate,
            'MM/dd/yyyy'
          );
          element['gaugeId'] = element.gauge.gaugeId;
          this.data.push(element);
        });
        if (this.gaugeData)
          this.dataSourceHistory = new MatTableDataSource(this.data);

        this.dataSourceHistory.sort = this.sort;

        this.gaugeHistoryLength = x.count;
        this.count = Number(this.dataSourceHistory.data.length);
        if (this.count <= 10) this.paginationArray2 = [10];
        else if (this.count <= 25) this.paginationArray2 = [10, 25];
        else if (this.count <= 50) this.paginationArray2 = [10, 25, 50];
        else if (this.count <= 100) this.paginationArray2 = [10, 25, 50, 100];
        else if (this.count > 100)
          this.paginationArray2 = [10, 25, 50, 100, this.count];
        // this.dataSourceHistory.filterPredicate = (data: any, filter: string) =>
        //   !filter || data.createdDate.includes(filter);
      })
      .catch();
  }
  getGetInfoGaugeRecordsWithDate(event: any) {
    let period: any = {
      startDate: new Date(),
      endDate: new Date(),
    };

    if (
      this.Historyrange.controls.Historyend.value &&
      this.Historyrange.controls.Historystart.value
    ) {
      period.startDate = this.Historyrange.controls.Historystart.value;
      period.enddate = this.Historyrange.controls.Historyend.value;
      this.dataService
        .post(
          `${this.baseUrl + ApiEndpointType.GetHistoryGaugeWithFilter}`,
          period
        )
        .then((x: any) => {
          this.data = [];
          this.gaugeData = x;

          this.gaugeData.forEach((element: any) => {
            element['createdDate'] = this.datepipe.transform(
              element.createdDate,
              'MM/dd/yyyy'
            );
            this.data.push(element);
          });

          if (this.gaugeData)
            this.dataSourceHistory = new MatTableDataSource<any>(this.data);
          this.dataSourceHistory.sort = this.sort;

          this.count = Number(this.dataSourceHistory.data.length);
          if (this.count <= 10) this.paginationArray2 = [10];
          else if (this.count <= 25) this.paginationArray2 = [10, 25];
          else if (this.count <= 50) this.paginationArray2 = [10, 25, 50];
          else if (this.count <= 100) this.paginationArray2 = [10, 25, 50, 100];
          else if (this.count > 100)
            this.paginationArray2 = [10, 25, 50, 100, this.count];
          this.dataSourceHistory.filterPredicate = (
            data: any,
            filter: string
          ) => !filter || data.createdDate.includes(filter);
        })
        .catch();
    }
  }
  data: any[] = [];

  addEvent(filterValue: any, event: any) {
    if (event.value != undefined) {
      filterValue = this.datepipe.transform(filterValue, 'MM/dd/yyyy');
    }
    this.dataSourceHistory.filter = filterValue.trim();
  }
  checkedCheckBoxForAdmin(user: any): boolean {
    let role = user.role?.split(',').filter((x: any) => x == 'CompanyAdmin');
    if (role && role.length > 0)
      if (role[0] == 'CompanyAdmin') return true;
      else return false;
    else return false;
  }
  checkedCheckBoxForSupplier(user: any): boolean {
    let role = user.role?.split(',').filter((x: any) => x == 'Supplier');
    if (role && role.length > 0)
      if (role[0] == 'Supplier') return true;
      else return false;
    else return false;
  }
  checkedCheckBoxForRead(user: any): boolean {
    let role = user.role?.split(',').filter((x: any) => x == 'Read');
    if (role && role.length > 0)
      if (role[0] == 'Read') return true;
      else return false;
    else return false;
  }
  SendInvite(User: any) {
    let flag: boolean = false;
    if (User.role == 'Read') flag = true;
    if (User.role == 'Supplier') flag = true;

    if (User.role == 'CompanyAdmin') flag = true;

    if (!flag)
      this.toastr.info(
        'Invite cannot be sent until at least one check box has been marked (Supplier,Read,Admin).',
        'INFO'
      );
    else this.sendInvitation(User.email);
  }
  handleSelected($event: any, type: string, user: any) {
    user;
    let obj: any = {
      Id: '',
      Read: false,
      Supplier: false,
      Admin: false,
    };
    if ($event.target.checked === true) {
      switch (type) {
        case 'ADMIN':
          obj.Id = user.id;
          obj.Read = false;
          obj.Supplier = false;
          obj.Admin = true;
          this.updateTheRoleOfUser(obj);
          break;
        case 'SUPPLIER':
          if (user.role.split(',').filter((x: any) => x == 'Read')[0] == 'Read')
            obj.Read = true;
          else obj.Read = false;

          obj.Id = user.id;
          obj.Supplier = true;
          obj.Admin = false;
          this.updateTheRoleOfUser(obj);
          break;
        case 'READ':
          if (
            user.role.split(',').filter((x: any) => x == 'Supplier')[0] ==
            'Supplier'
          )
            obj.Supplier = true;
          else obj.Supplier = false;

          obj.Id = user.id;
          obj.Read = true;
          obj.Admin = false;
          this.updateTheRoleOfUser(obj);
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case 'ADMIN':
          obj.Id = user.id;
          obj.Read = false;
          obj.Supplier = false;
          obj.Admin = false;
          this.updateTheRoleOfUser(obj);
          break;
        case 'SUPPLIER':
          if (user.role.split(',').filter((x: any) => x == 'Read')[0] == 'Read')
            obj.Read = true;
          else obj.Read = false;

          obj.Id = user.id;
          obj.Supplier = false;
          obj.Admin = false;
          this.updateTheRoleOfUser(obj);
          break;
        case 'READ':
          if (
            user.role.split(',').filter((x: any) => x == 'Supplier')[0] ==
            'Supplier'
          )
            obj.Supplier = true;
          else obj.Supplier = false;

          obj.Id = user.id;
          obj.Read = false;
          obj.Admin = false;
          this.updateTheRoleOfUser(obj);
          break;
        default:
          break;
      }
    }
  }
  updateTheRoleOfUser(element: any) {
    this.dataService
      .post(`${this.baseUrl + ApiEndpointType.AcountPrivilleges}`, element)
      .then((x: any) => {
        if (x) this.toastr.success(x.message, 'SUCCESS');

        this.getAccountPrivillegesUsers();
      })
      .catch((x) => {
        this.toastr.error(x.error, 'ERROR');
      });
  }
  openModalToAddUser() {
    const dialogRef = this.dialog.open(AdminUsersAddComponent, {
      data: {
        type: 'calibration',
      },
    });
    let afterclose = dialogRef.afterClosed().subscribe((x) => {
      this.getAccountPrivillegesUsers();
    });
  }
  openModalToEditUser(element: any) {
    const dialogRef = this.dialog.open(AdminUsersAddComponent, {
      data: {
        data: element,
        type: 'calibration',
      },
    });
  }
  dateRangeStatusForStatus: boolean = false;
  selectAllStatus(event: any) {
    event.value == 'DateRange'
      ? (this.dateRangeStatusForStatus = true)
      : (this.dateRangeStatusForStatus = false);
      if(!this.dateRangeStatusForStatus){
        this.getListofGaugeAccordingStatusWithMultipleSelect()
      }
  }

  dateRangeStatusForStatusHistory: boolean = false;
  selectAllStatusHistory(event: any) {
    event.value == 'DateRange'
      ? (this.dateRangeStatusForStatusHistory = true)
      : (this.dateRangeStatusForStatusHistory = false);

    if (!this.dateRangeStatusForStatusHistory) this.getGetInfoGaugeRecords();
  }

  //get suppliers list
  supplerList: any[] = [];
  getSupplierList() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetSupplierList)
      .then((x: any) => {
        if (x) this.supplerList = x;
      })
      .catch((x) => {});
  }

  deleteSupplier(val: any) {
    if (confirm('Are you sure you want to delete this Gauge Supplier?'))
      this.dataService
        .getAll(`${this.baseUrl + ApiEndpointType.DeleteGaugeSupplier}/${val}`)
        .then((x: any) => {
          if (x) this.toastr.success(x.message, 'SUCCESS');
          this.getSupplierListWithoutUser();
        })
        .catch((x: any) => {
          if (x) this.toastr.error(x.error, 'ERROR');
        });
  }

  lastRecordAdded: any;
  //to get the last record
  lastRecordOfGauge() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GaugeLastRecord)
      .then((x: any) => {
        if (x) {
          this.lastRecordAdded = x;
          this.GetGaugeDueIn(this.lastRecordAdded.id);
        }
      })
      .catch((x) => {});
  }
  gaugeDueIn: any = {
    id: '',
    days: 0,
  };
  frequancy: string = '';
  GetGaugeDueIn(val: any) {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.GetGaugeDueIn}/${val}`)
      .then((x: any) => {
        if (x) {

          this.gaugeDueIn.id = val;
          this.frequancy = x.frequancyName;

          switch ( this.frequancy) {
      case 'Weekly':
        this.fequancyValue ='1'
        break;
        case 'Biweekly':
          this.fequancyValue ='2'
          break;
          case 'Monthly':
            this.fequancyValue ='3'
            break;
            case 'Quarterly':
              this.fequancyValue ='4'
              break;
      default:
        break;
     }
          this.gaugeDueIn.days = x.duedays;
        }
      })
      .catch((x) => {

      });
  }
  getChangeDueDays(val: any) {

    let duration: string = '';
    let frequancy: number = 0;
    if (this.fequancyValue) frequancy = +this.fequancyValue;
    else {
      this.toastr.error('Please select frequancy first', 'ERROR');
      return;
    }

    switch (frequancy) {
      case 1:
        duration = 'Weekly';
        break;
      case 2:
        duration = 'Biweekly';
        break;
      case 3:
        duration = 'Monthly';
        break;
      case 4:
        duration = 'Quarterly';
        break;
      default:
        break;
    }
    let durationValue = +duration;

    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.UpdateGaugedue}/${
          this.lastRecordAdded.companyID
        }/${val}/${duration}`
      )
      .then((x: any) => {

        if (x) {
          this.toastr.success(x.message, 'SUCCESS');
        }
      })
      .catch((x) => {});
  }
  companyData: any = {};
  totalNumberOfLincenses: number = 0;
  PurchasedCustomCoursesCreator: boolean = false;
  PricePerUserTraning: number = 149;
  costPerLicense: number = 67;
  costPerLicenseSpanishLanguage: number = 26;
  IsCustomCoursesPurchased: boolean = false;
  CustomCoursesAndSoftwarePricePerUser: number = 242;
  GaugeProPrice: number = 795;
  CalibrationEnterPrise:number = 1495
  SupplierProPrice: number = 399;
  MyExCoursesAlternative: number = 175;
  MyExCoursesWithoutSpanish: number = 216;
  openShoppingModalToggle: boolean = false;

  //shopping cart for spanish language
  purchasedSpanishLanguage: boolean = false;
  purchasedSpanishCardToggele: boolean = false;
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
  //       PurchasedSupplierPro: this.companyData.purchasedSupplierPro,
  //       PurchasedCalibration: this.companyData.purchasedCalibration,
  //       CalibrationReportsSettings: true
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((x: any) => {
  //     // this.spanishToggle.checked = false;
  //     // this.createCoursesToggle.checked = false;
  //     // this.openShoppingModalToggle = false;
  //     // this.purchasedSpanishCardToggele = false;
  //     this.GetTotalLicenses();
  //   });
  // }
  //function is to open the shopping  modal
  openShoppingModal() {

    localStorage.setItem('place', 'calibration');
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
            PurchasedSpanishLanguageCourse:
              this.companyData.purchasedSpanishLanguageCourse,
              //purchasedCalibrationEnterprise
              PurchasedCalibrationEnterprise: this.companyData.purchasedCalibrationEnterprise,
              CalibrationEnterPrise:this.CalibrationEnterPrise
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
              CalibrationEnterPrise:this.CalibrationEnterPrise

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

  //Get Total Licenses
  GetTotalLicenses() {
    this.dataService
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
  setFreQuancy() {}
  getStatus(event: any) {

    // switch (event.value) {
    //   case 1:
    //     this.fequancyValue ='Weekly'
    //     break;
    //     case 2:
    //       this.fequancyValue ='Biweekly'
    //       break;
    //       case 3:
    //         this.fequancyValue ='Monthly'
    //         break;
    //         case 4:
    //           this.fequancyValue ='Quarterly'
    //           break;
    //   default:
    //     break;
    //  }

    this.fequancyValue = event.value;

    this.UpdateFrequancyOfEmailNoti(event.value);
  }
  UpdateFrequancyOfEmailNoti(val: number) {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.UpdateFrequancyOfEmailNoti}/${val}`
      )
      .then((x) => {

        let duration: string = '';
        let frequancy=+this.fequancyValue
        switch (frequancy) {
          case 1:
            duration = 'Weekly';
            break;
          case 2:
            duration = 'Biweekly';
            break;
          case 3:
            duration = 'Monthly';
            break;
          case 4:
            duration = 'Quarterly';
            break;
          default:
            break;
        }
        this.toastr.success(
          'The frequency is set to ' + duration + '.',
          'SUCCESS'
        );
      })
      .catch((x) => {});
  }
  historyShowCheck: boolean = false;
  downloadPdfwithCheck(val: string, tableId: string) {
    var dummy = document.getElementById(tableId);
    const title: string = this.historyTableTitle.nativeElement.innerText;
    // this.historyShowCheck = true;
    if (this.dataSourceHistory?.data?.length > 0) {
      this.historyShowCheck = true;
      //let data: any = document.getElementById('contentToConvert');
     // this.excelService.downloadpdf(data, val);
      //this.excelService.convertToPdf(data,val)
      this.excelService.downloadPDF(tableId, 95, val, title);
      this.historyShowCheck = false;
    } else {
      this.toastr.info('No data to download');
    }
  }

  downloadExecel() {
    if (this.dataSourceHistory?.data?.length > 0)
      this.excelService.downloadExcelFile(
        this.shapeData(this.dataSourceHistory.data),
        'History'
      );
    else {
      this.toastr.info('No data to download');
    }
  }
  addSupplierCheck: boolean = false;
  addSupplierByText(val: string) {
    if (val == '') {
      this.addSupplierCheck = true;
      return;
    } else this.addSupplierCheck = false;
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = this.supplierUpdateId;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.AddUpdateGaugeSupplier, data)
      .then((x: any) => {
        this.toastr.success('Record Updated successfully.', 'SUCCESS');
        this.supplierUpdateId = 0;
        this.getSupplierListWithoutUser();
      })
      .catch((x: any) => {
        this.toastr.error('Duplicate record.', 'ERROR');
      });
    this.closeaddSupplier();
  }

  //Function to Add Gauge Owner Field
  UpdateOwnerField(val: string) {
    if (val == '') {
      this.addOwn = true;
      return;
    } else this.addOwn = false;
    let data: any = {
      id: 0,
      name: '',
    };
    data.id = 0;
    data.name = val;
    this.dataService
      .post(this.baseUrl + ApiEndpointType.GaugeOwnerUpdate, data)
      .then((x: any) => {
        this.toastr.success('Record Updated successfully.', 'SUCCESS');
        this.GetOwnerList();
      })
      .catch();
    this.closeOwnerAdd();
  }
  getSupplierListWithoutUserList: any;
  getSupplierListWithoutUser() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetSupplierListWithoutUser)
      .then((x: any) => {
        if (x) this.getSupplierListWithoutUserList = x;
      })
      .catch((x) => {});
  }
  sendInvitation(val: string) {

    this.dataService
      .post(this.baseUrl + ApiEndpointType.InviteViaEmail, {
        email: val,
        baseUri: environment.baseUri,
      })
      .then((res: any) => {
        if (res) this.toastr.success(res.message, 'SUCCESS');
      })
      .catch((err) => {
        this.toastr.error(err.error, 'ERROR');
      });
  }

  checkEmailSendMethod() {
    this.dataService
      .getAll(this.baseUrl + '/api/gauge/EmailNotificationGauges')
      .then((res: any) => {
        if (res) this.toastr.success(res.message, 'SUCCESS');
      })
      .catch((err) => {
        this.toastr.error(err.error, 'ERROR');
      });
  }
  createData(val: any): any {
    let data: any = {
      Due_Date: '',
      Gauge_ID: '',
      S_N: '',
      Status: '',
      Description: '',
      Last_Calibrated: '',
      Gauge_Location: '',
      Manufacturer: '',
      Supplier: '',
    };
    let obj: any[] = [];

    if (val) {
      //    this.setDataForPie();
      val.forEach((element: any) => {
        data.Due_Date = this.datepipe.transform(
          this.setDueDate(element.calibrationDate, element.gaugeId),
          'MM/dd/yyyy'
        );
        data.Gauge_ID = element.gaugeId;
        data.S_N = element.serialNumber;
        data.Status = element.gaugeStatus.name;
        data.Last_Calibrated = this.datepipe.transform(
          element.calibrationDate,
          'MM/dd/yyyy'
        );
        data.Gauge_Location = element.gaugeLocation?.name;
        data.Manufacturer = element.gaugeManufacturer?.name;
        data.Description = element.description;
        data.Supplier = element.gaugeSupplier?.name;
        obj.push(data);
        data = {};
      });
      return obj;
    }
  }
  setDueDate(calibration: any, guageId: any) {
    return this.formatDate(
      new Date(
        new Date().setMonth(
          new Date(this.formatDate(new Date(calibration))).getMonth() +
            this.dataOfGaugeStatusReport.find((x: any) => x.gaugeId == guageId)
              .frequency
        )
      )
    );
  }
  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  shapeData(val: any): any {
    let data: any = {
      GaugeID: '',
      Changes: '',
      User: '',
      UpdatedDate: '',
    };
    let obj: any[] = [];

    if (val) {
      //    this.setDataForPie();
      val.forEach((element: any) => {
        data.Due_Date = this.datepipe.transform(
          element.updatedDate,
          'MM/dd/yyyy'
        );
        data.GaugeID = element.gaugeId;
        data.Changes = element.actions;
        data.User = element.userId;
        obj.push(data);
        data = {};
      });
      return obj;
    }
  }
}
