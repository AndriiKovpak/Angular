import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeAddCredentialsComponent } from '../../core/modal/employee-add-credentials/employee-add-credentials.component';
import { history } from './model/history.model';
import { DatePipe } from '@angular/common';
import { FileSaverService } from 'ngx-filesaver';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { getPagenation } from '../../core/_helpers/pagenation-array';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;
  @ViewChild('MatPaginator3') MatPaginator3!: MatPaginator;
  @ViewChild('hBSort') hBSort!: MatSort;
  @ViewChild('sBSort') sBSort!: MatSort;
  @ViewChild('cSort') cSort!: MatSort;
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  treeControl = new NestedTreeControl<any>((node) => node.children);
  treedataSource = new MatTreeNestedDataSource<any>();

  filterValues = {
    course: '',
  };
  obj: any = {
    course: '',
  };
  //this is used to filter the individual column
  fullNameFilter = new FormControl('');
  //columns to display for credentials
  columnsToDisplayFoHistory = ['course', 'pass', 'score', 'date'];
  historyDataSource: any;

  formDisable: boolean = true;

  EmpForm!: FormGroup;
  submitted: boolean = false;
  baseUrl: string = environment.apiBase;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();

  filteredFruits!: Observable<string[]>;
  fruits: string[] = [];
  allDepartments: any[] = [];
  allFruits: string[] = [];
  historyList: any[] = [];
  CredentialTypeSelectList: any[] = [];
  filteredDataHistoryList: history[] = [];
  rowData: history[] = [];
  treeTableDataSource: any[] = [];

  activeCustomCourses: boolean = false;
  customCoursesActive: string = 'Active';
  customRangeData: string = '12 months';
  showDateRange: boolean = false;
  languagePreference: string = 'en';

  paginationPageSize = 10;
  pagination = true;
  columnDefs = [
    { field: 'course', sortable: true, filter: true, search: true, width: 300 },
    { field: 'pass', width: 100 },
    { field: 'score', width: 100 },
    { field: 'date', width: 150 },
  ];
  paginationArray: number[] = [5];
  opened: boolean = false;
  selectedDepartmentid: number[] = [];
  public form: any;

  // columns to display for tree
  columnsToDisplay = [
    'companyCourse',
    'nextDueDateOverride',
    'strDeuOverDueDate',
  ];

  //columns to display for credentials
  columnsToDisplayCredentials = [
    'credentialType',
    'name',
    'date',
    'action',
  ];
  credentialsDataSource = new MatTableDataSource();
  displayedColumns: string[] = ['companyCourse'];
  dataSource = new MatTableDataSource();
  userInfo: any;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  events: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private _FileSaverService: FileSaverService,
    public translationService: TranslationService,
    private route: Router,
    public translate: TranslateService,
    private langService: LanguageService,
  ) {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
      this.languagePreference = localStorage.getItem('lang')
        ? localStorage.getItem('lang')
        : this.userInfo?.languagePreference
          ? this.userInfo?.languagePreference
          : 'en';
    });
  }

  redirect(val: string) {
    this.route.navigate(['/employee-home/course', { id: val }]);
  }

  onChangeHistoryFilter(event: any) {
    this.historyDataSource.data = this.rowData.filter(e => e.course.toLowerCase().includes(event.target.value.toLowerCase()));
    this.paginationArray = getPagenation(this.historyDataSource.data.length);
  }

  onCustomCoursesSelectionData() {
    this.customRangeData == 'DateRange'
      ? (this.showDateRange = true)
      : (this.showDateRange = false);
    if (this.customRangeData == 'All' || this.customRangeData == '12 months') {
      this.GetCredentialTypeSelectListWithRange();
    }
  }
  //this function is used to get data for credentials tab
  GetCredentialTypeSelectListWithRange() {
    let data: any = {
      UserId: this.userInfo.userId,
      isActiveInActive: this.activeCustomCourses,
      start: this.range.value.start,
      end: this.range.value.end,
      range: this.customRangeData,
    };
    this.crudService
      .post(
        this.baseUrl + ApiEndpointType.GetUserCredentialsByUser,
        data
      )
      .then((x: any) => {
        let data = x.userCredentialModelList;
        data.forEach((element: any) => {
          element.credentialType = this.langService.simplifyData(
            element.credentialType,
            this.languagePreference
          );
        });
        data.forEach((element: any) => {
          element.name = this.langService.simplifyData(
            element.name,
            this.languagePreference
          );
        });
        this.credentialsDataSource.data = [...data];
        this.credentialsDataSource.sort = this.cSort;
        this.credentialsDataSource.paginator = this.MatPaginator2;
        this.customCoursesActive === 'Active'
          ? (this.activateAfterData = false)
          : (this.activateAfterData = true);
      })
      .catch((x) => { });
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    this.GetCredentialTypeSelectListWithRange();
  }
  hasChild = (_: number, node: any) =>
    !!node.children && node.children.length > 0;

  disabled: boolean = true;
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userDetails') ?? '');
    this.intializeForm();
    this.GetUserDetailById();
    this.GetAllUpcomingUserTrainingPlanByUser();
    this.getFrequancy();
    this.GetCredentialTypeSelectListWithRange();
    this.GetCredentialTypeSelectList();
    this.GetHistoryList();
    this.filters();
    this.GetCompanyByUser();
  }

  //this function is used to intialize
  intializeForm() {
    this.EmpForm = this.formBuilder.group({
      companyID: new FormControl(null),
      role: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      exSafetyEmail: new FormControl(''),
      safetySenstive: new FormControl(1, [Validators.required]),
      // status: new FormControl('', [Validators.required]),

      phoneNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      supervisorEmail: new FormControl('', [Validators.email]),
      isSafetySensitive: new FormControl(false)
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.EmpForm.controls;
  }

  //this function is use to save the data
  Save() {
    this.submitted = true;
    if (this.EmpForm.invalid) {
      return;
    }
  }

  Count: any;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    let data: any = this.allDepartments.find((x) => x.text == fruit);
    if (data) {
      this.userModel.selectedDepartmentIds =
        this.userModel.selectedDepartmentIds.filter(
          (x: any) => x != data.value
        );
    }
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    this.updateData();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.viewValue;
    let data: any = this.allDepartments.find(
      (x) => x.text == event.option.viewValue
    );
    if (data) {
      this.userModel.selectedDepartmentIds.push(data.value);
    }

    this.selectedId;
    if (this.fruits.includes(newValue)) {
      this.fruits = [...this.fruits.filter((fruit) => fruit !== newValue)];
    } else {
      this.fruits.push(event.option.viewValue);
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);

    // keep the autocomplete opened after each item is picked.
    requestAnimationFrame(() => {
      this.openAuto(this.matACTrigger);
    });
    this.updateData();
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.fruitInput.nativeElement.focus();
  }

  selectedId: number = 0;
  //this function is used to get selected companies
  GetCompanySelectList() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanySelectList)
      .then((x: any) => {
        if (x) {
          this.allDepartments = x;
          x.forEach((element: any) => {
            this.fruits = [];
            this.fruits.push(element.text);
          });
          this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) =>
              fruit ? this._filter(fruit) : this.allFruits.slice()
            )
          );

          // this.filteredOptions = this.myControl.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this._filter(value))
          // );
        }
      })
      .catch((x) => { });
  }

  //get department by company
  GetDepartmentSelectListByCompany(val: any) {
    // this.service.getBlobSingleWithParams(`${this.baseUrl + ApiEndpointType.DownloadCompanyAdminUserCourseTraningMatrixReport}/${isCustomCourse}`)
    this.fruits = [];
    this.crudService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetDepartmentSelectListByCompany
        }/${val}`
      )
      .then((x: any) => {
        if (x) {
          this.allDepartments = x;
          x.forEach((element: any) => {
            this.allFruits.push(element.text);
          });
          this.selectedDepartmentid.forEach((element: any) => {
            let data = x.find((x: any) => x.value == element);
            if (data) {
              this.fruits.push(data.text);
            }
          });
          this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) =>
              fruit ? this._filter(fruit) : this.allFruits.slice()
            )
          );
        }
      })
      .catch((x) => { });
  }

  userModel: any;
  //Get User Detail By Id
  GetUserDetailById() {
    this.crudService
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetUserDetailById +
        '/' +
        this.userInfo.userId
      )
      .then((x: any) => {
        if (x && x.userModel) {
          this.userModel = x.userModel;

          this.EmpForm.patchValue(x.userModel);
          this.EmpForm.patchValue({ safetySenstive: x.userModel.safetySensitiveType });
          this.EmpForm.disable();
          this.selectedDepartmentid = x.userModel.selectedDepartmentIds;
          this.GetDepartmentSelectListByCompany(x.userModel.companyID);
        }
      })
      .catch((x) => { });
  }

  onBlurMethod(val: string) {
    if (this.EmpForm.controls.supervisorEmail.errors) {
      return;
    }
    if (this.EmpForm.controls.email.errors) return;

    this.updateData();
  }

  onEdit(val: string) {

    if (this.formDisable == true) {
      this.toastr.success('Profile locked by company admin.');
      return;
    } else {
      switch (val) {
        case 'title':
          this.EmpForm.controls.title.enable();
          break;
        case 'firstName':
          if (this.credentialsDataSource.data.length > 0) {

            this.toastr.success('Not able to edit because of credentials present.');
            return
          }

          this.EmpForm.controls.firstName.enable();
          break;

        case 'lastName':
          if (this.credentialsDataSource.data.length > 0) {

            this.toastr.success('Not able to edit because of credentials present.');
            return
          }

          this.EmpForm.controls.lastName.enable();
          break;

        case 'email':
          if (this.credentialsDataSource.data.length > 0) {

            this.toastr.success('Not able to edit because of credentials present.');
            return
          }

          this.EmpForm.controls.email.enable();
          break;

        case 'SupervisorEmail':
          this.EmpForm.controls.supervisorEmail.enable();
          break;

        case 'departments':
          this.EmpForm.controls.title.value;
          break;

        case 'exSafetyEmail':
          this.EmpForm.controls.exSafetyEmail.enable();
          break;

        case 'phoneNumber':
          this.EmpForm.controls.phoneNumber.enable();
          break;
        case 'safetySenstive':
          this.EmpForm.controls.safetySenstive.enable();
          break;
        // case 'status':
        // this.EmpForm.controls.status.enable();
        // break;
        case 'Street':
          this.EmpForm.controls.street.enable();
          break;

        case 'City':
          this.EmpForm.controls.city.enable();
          break;

        case 'ZipCode':
          this.EmpForm.controls.zipCode.enable();
          break;

        case 'State':
          this.EmpForm.controls.state.enable();
          break;

        case 'matchip':
          this.disabled = false;
          break;

        default:
          break;
      }
    }
  }


  //check supervisor email and selectedDepartmentIds
  updateData() {
    this.userModel;
    let data: any = {
      Id: this.userInfo.userId,
      companyID: this.EmpForm.controls.companyID.value,
      role: this.EmpForm.controls.role.value,
      title: this.EmpForm.controls.title.value,
      firstName: this.EmpForm.controls.firstName.value,
      lastName: this.EmpForm.controls.lastName.value,
      email: this.EmpForm.controls.email.value,
      phoneNumber: this.EmpForm.controls.phoneNumber.value,
      street: this.EmpForm.controls.street.value,
      city: this.EmpForm.controls.city.value,
      zipCode: this.EmpForm.controls.zipCode.value,
      state: this.EmpForm.controls.state.value,
      selectedDepartmentIds: this.userModel.selectedDepartmentIds,
      IsSafetySensitive: this.EmpForm.controls.safetySenstive.value == 0 ? false : true,
      languagePreference: this.userModel.languagePreference,
      noOfLicenses: this.userModel.noOfLicenses,
      safetySensitiveType: +this.EmpForm.controls.safetySenstive.value,
      ExSafetyEmail: this.EmpForm.controls.exSafetyEmail.value,
      userStatusID: this.userModel.userstatusID,
      supervisorEmail: this.EmpForm.controls.supervisorEmail.value,
      companyName: this.userModel.companyName,
    };

    this.crudService
      .post(this.baseUrl + ApiEndpointType.UpdateUserDetail, data)
      .then((x: any) => {
        if (x && x.message) {
          this.toastr.success(x.message, 'SUCCESS');
        }
        this.EmpForm.disable();
        this.GetUserDetailById();
      })
      .catch((x) => { });
  }

  getFrequancy() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetFrequencies)
      .then((x: any) => {
        if (x && x.frequencyModelList) {
          let data: any = {
            id: 0,
            name: '',
            children: [{ name: 'abc' }],
          };
          let compilesData: any[] = [];
          x.frequencyModelList.forEach((element: any) => {
            data.id = element.frequencyID;
            data.name = element.name;
            compilesData.push(data);
            data = {
              name: '',
              children: [{ name: element.name }],
            };
          });
          this.treedataSource.data = compilesData;
        }
      })
      .catch((x) => { });
  }

  showNode(val: any) {
    if (!this.treeControl.isExpanded(val)) {
      this.treeControl.collapseAll();
      return;
    }

    this.treeControl.collapseAll();
    this.treeControl.expand(val);
    this.treeTableDataSource = [];
    this.crudService
      .getAll(
        `${this.baseUrl +
        ApiEndpointType.GetAllUserTrainingPlanByFrequencyAndUser
        }/${val.id}/${this.userInfo.userId}`
      )
      .then((x: any) => {
        let data = x.userTrainingPlanModelList;

        data.forEach((element: any) => {
          element.companyCourse = this.langService.simplifyData(
            element.companyCourse,
            this.languagePreference
          );
        });
        data.forEach((element: any) => {
          element.strDeuOverDueDate = this.langService.simplifyData(
            element.strDeuOverDueDate,
            this.languagePreference
          );
        });
        this.treeTableDataSource = [...data];
      })
      .catch((x) => { });
  }

  //this to get active and inactive custom courses
  onCustomCoursesSelection() {
    this.customCoursesActive === 'Active'
      ? (this.activeCustomCourses = false)
      : (this.activeCustomCourses = true);
    this.GetCredentialTypeSelectListWithRange();
  }

  activateAfterData: boolean = false;

  //this function is used to delete the company courses
  deleteCompanyCourses(val: any, type: string) {
    if (val && val > 0) {
      let active: boolean = false;
      type === 'delete' ? (active = true) : active;
      active
        ? confirm('Are you sure you want to delete this record?')
        : confirm('Are you sure you want to restore this record?');
      this.crudService
        .getAll(
          this.baseUrl +
          ApiEndpointType.deleteUserCredentials +
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

            this.GetCredentialTypeSelectListWithRange();
          }
        })
        .catch((x) => { });
    }
  }

  //this function is used to open the modal to add credentials
  openModal() {
    const dialogRef = this.dialog.open(EmployeeAddCredentialsComponent, {
      data: {
        data: this.CredentialTypeSelectList,
        applicationUserId: this.userInfo.userId,
      },
    });
  }

  //this function is used to get data for credentials tab
  GetCredentialTypeSelectList() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetCredentialTypeSelectList)
      .then((x: any) => {
        if (x) this.CredentialTypeSelectList = x;
      })
      .catch((x) => { });
  }

  //filter created to provide to mat table
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data?.course?.toLowerCase().indexOf(searchTerms.course) !== -1;
      // && data?.userStatusName?.toLowerCase().indexOf(searchTerms.userStatusName) !== -1;
    };
    return filterFunction;
  }
  setDataForHistory() {
    this.historyList.forEach((element: any) => {
      element.companyCourse = this.langService.simplifyData(
        element.companyCourse,
        this.languagePreference
      );
    });
  }
  //this function is used to get the history tab data
  GetHistoryList() {
    this.crudService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetUserCourseHistoriesByUser}/${this.userInfo.userId
        }`
      )
      .then((x: any) => {
        if (x) this.historyList = x.userCourseHistoryModelList;
        let data: history = {
          date: '',
          course: '',
          pass: '',
          score: '',
        };
        this.setDataForHistory();
        this.historyList.forEach((element: any) => {
          data.course = element.companyCourse;
          data.score = element.testScore;
          data.pass =
            this.languagePreference == 'en'
              ? (data.pass = element.passed ? 'Yes' : 'No')
              : element.passed
                ? 'sí'
                : 'No';
          data.date = this.datepipe.transform(element.date, 'MM/dd/yyyy') ?? '';
          this.filteredDataHistoryList.push(data);
          data = {
            date: '',
            course: '',
            pass: '',
            score: '',
          };
        });
        this.rowData = this.filteredDataHistoryList;
        this.historyDataSource = new MatTableDataSource<any>(this.rowData);
        this.historyDataSource.paginator = this.MatPaginator3;
        this.historyDataSource.sort = this.hBSort;
        this.historyDataSource.filterPredicate = this.createFilter();
        if (this.historyDataSource.data.length <= 10)
          this.paginationArray = [10];
        else if (this.historyDataSource.data.length <= 25)
          this.paginationArray = [10, 25];
        else if (this.historyDataSource.data.length <= 50)
          this.paginationArray = [10, 25, 50];
        else if (this.historyDataSource.data.length <= 100)
          this.paginationArray = [10, 25, 50, 100];
        else if (this.historyDataSource.data.length > 100)
          this.paginationArray = [
            10,
            25,
            50,
            100,
            this.historyDataSource.data.length,
          ];
      })
      .catch((x) => { });
  }
  //filters of individual  columns
  filters() {
    // filter for fullName

    this.fullNameFilter.valueChanges.subscribe((fullName) => {
      this.filterValues.course = fullName;
      this.historyDataSource.filter = JSON.stringify(this.filterValues);
      this.obj.course = fullName;
    });
  }
  upcomingUserTrainingPlans: any;
  //upcoming User training plans
  GetAllUpcomingUserTrainingPlanByUser() {
    this.crudService
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetAllUpcomingUserTrainingPlanByUser +
        '/' +
        this.userInfo.userId
      )
      .then((x: any) => {
        if (x) {
          this.upcomingUserTrainingPlans = x;
          this.setdata();
        }
      })
      .catch((x) => { });
  }
  setdata() {
    this.upcomingUserTrainingPlans.userTrainingPlanModelList.forEach(
      (element: any) => {
        element.companyCourse = this.langService.simplifyData(
          element.companyCourse,
          this.languagePreference
        );
      }
    );
    this.upcomingUserTrainingPlans.userTrainingPlanModelList.forEach(
      (element: any) => {
        element.strDeuOverDueDate = this.langService.simplifyData(
          element.strDeuOverDueDate,
          this.languagePreference
        );
      }
    );
    this.dataSource = new MatTableDataSource<any>(
      this.upcomingUserTrainingPlans.userTrainingPlanModelList
    );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  //this function is used to download all the certificates
  downloadamtawardsreport() {
    this.crudService
      .getBlobSingleWithParams(
        `${this.baseUrl + ApiEndpointType.DownloadAllUserCredentialDocument}/${this.userInfo.userId
        }`
      )
      .then((x) => {
        if (x) {
          let fileName = 'Document_' + this.userInfo.userId + '.pdf';
          this._FileSaverService.save(x, fileName);
        } else {
          this.toastr.info('No certificate found.');
        }
      })
      .catch((x) => {
        this.toastr.info('No certificate found.');
      });
  }

  //this function is to download for per record
  download(element: any) {
    if (element && element.applicationUserID)
      this.crudService
        .getBlobSingleWithParams(
          `${this.baseUrl + ApiEndpointType.DownloadUserCredentialDocument}/${element.credentialID
          }`
        )
        .then((x) => {
          if (x) {
            let fileName = 'Document_' + element.applicationUserID + '.pdf';
            this._FileSaverService.save(x, fileName);
          } else {
            this.toastr.info('No certificate found.');
          }
        })
        .catch((x) => {
          this.toastr.info('No certificate found.');
        });
  }

  edit(element: any) {
    const dialogRef = this.dialog.open(EmployeeAddCredentialsComponent, {
      data: {
        data: this.CredentialTypeSelectList,
        applicationUserId: this.userInfo.userId,
        element: element,
      },
    });
  }

  checkColor(val: any): boolean {
    let returnValue: boolean = false;
    if (!val.indexOf('Overdue')) {
      let regex = /\d+/g;
      let matches = +val.match(regex); // creates array from matches
      if (matches) {
      } else {
        // No Digits found in the string.
      }
      return (returnValue = true);
    } else return false;
  }
  checkColordue(val: any): boolean {
    let returnValue: boolean = false;
    if (!val.indexOf('Due')) {
      let regex = /\d+/g;
      let matches = +val.match(regex); // creates array from matches
      if (matches) {
        if (matches < 30) return (returnValue = false);
      } else {
        // No Digits found in the string.
      }
      return (returnValue = true);
    } else return false;
  }
  lockUsersCredentials: boolean = false;

  GetCompanyByUser() {

    this.crudService
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetCompanyByUser +
        '/' +
        this.userInfo.userId
      )
      .then((x: any) => {
        if (x) {
          this.lockUsersCredentials = x.lockUsersCredentials;
          this.formDisable = x.lockUsersProfile;
        }
      })
      .catch();
  }
}
