import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { AddCoursesMOdalComponent } from './../../core/modal/add-courses-modal/add-courses-modal.component';
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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { history } from './model/history.model';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { AdminUpdatePasswordComponent } from "../../core/modal/admin-update-password/admin-update-password.component";
import { UserCredentialsComponent } from '../../shared/components/user-credentials/user-credentials.component';
import { getPagenation } from '../../core/_helpers/pagenation-array';

@Component({
  selector: 'app-company-admin-employee',
  templateUrl: './company-admin-employee.component.html',
  styleUrls: ['./company-admin-employee.component.scss'],
})
export class CompanyAdminEmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('MatPaginator3') MatPaginator3!: MatPaginator;
  @ViewChild('hBSort') hBSort!: MatSort;
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
  @ViewChild('addSupplier') addSupplier!: ElementRef;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(UserCredentialsComponent) userCredentials!: UserCredentialsComponent;
  treeControl = new NestedTreeControl<any>((node) => node.children);
  treedataSource = new MatTreeNestedDataSource<any>();
  languagePreference: string = 'en';

  filterValues = {
    course: '',
  };
  obj: any = {
    course: '',
  };
  //this is used to filter the individual column
  fullNameFilter = new FormControl('');
  historyFilter = new FormControl('');
  //columns to display for credentials
  columnsToDisplayFoHistory = ['course', 'pass', 'score', 'date'];
  historyDataSource: any;

  EmpForm!: FormGroup;
  submitted: boolean = false;
  baseUrl: string = environment.apiBase;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();

  filteredFruits!: Observable<string[]>;
  fruits: string[] = [];
  allDepartments: any[] = [];
  allFruits: string[] = [];
  historyList: any[] = [];

  filteredDataHistoryList: history[] = [];
  rowData: history[] = [];
  treeTableDataSource: any[] = [];
  activeCustomCourses: boolean = false;
  customCoursesActive: string = 'Active';
  showDateRange: boolean = false;
  currentUserId!: string;
  paginationPageSize = 10;

  paginationArray: number[] = [5];
  selectedDepartmentid: number[] = [];

  // columns to display for tree
  columnsToDisplay = [
    'companyCourse',
    'nextDueDateOverride',
    'strDeuOverDueDate',
  ];

  displayedColumns: string[] = ['companyCourse', 'nextDueDateOverride', 'edit'];
  dataSource = new MatTableDataSource();
  userInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    public translationService: TranslationService,
    private route: Router,
    private router: ActivatedRoute,
    public translate: TranslateService,
    private langService: LanguageService
  ) {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
    this.languagePreference = localStorage.getItem('lang')
      ? localStorage.getItem('lang')
      : this.userInfo?.languagePreference
        ? this.userInfo?.languagePreference
        : 'en';
  }



  redirect(val: string) {
    this.route.navigate(['/employee-home/course', { id: val }]);
  }

  hasChild = (_: number, node: any) =>
    !!node.children && node.children.length > 0;

  disabled: boolean = true;
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userDetails') ?? '');

    this.router.params.subscribe((params: Params) => {
      if (params && params.id) {
        this.currentUserId = params.id;
      }
    });

    this.intializeForm();
    this.GetUserDetailById();
    this.GetAllUpcomingUserTrainingPlanByUser();
    this.getFrequancy();
    this.GetHistoryList();
    this.filters();
    this.getUserstatus();
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
      isSafetySensitive: new FormControl(true, [Validators.required]),
      status: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      supervisorEmail: new FormControl('', [Validators.email]),
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

  onHistoryFilter(event: any) {
    this.historyDataSource.data = this.rowData.filter(element => element.course.toLowerCase().includes(event.target.value.toLowerCase()));
    this.paginationArray = getPagenation(this.historyDataSource.data.length);
  }

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
  safetySensitiveSelectedValue: string = '';
  userStatus: string = '';
  userModel: any;

  //Get User Detail By Id
  GetUserDetailById() {
    this.crudService
      .getAll(
        this.baseUrl +
        ApiEndpointType.GetUserDetailById +
        '/' +
        this.currentUserId
      )
      .then((x: any) => {
        if (x && x.userModel) {
          this.userModel = x.userModel;
          this.EmpForm.patchValue({
            ...x.userModel,
            status: (x.userModel.userStatusID).toString(),
          });
          this.EmpForm.patchValue({});
          this.EmpForm.disable();
          this.selectedDepartmentid = x.userModel.selectedDepartmentIds;
          this.userStatus = (`${x.userModel.userStatusID}`).toString();
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
    switch (val) {
      case 'title':
        this.EmpForm.controls.title.enable();
        break;
      case 'firstName':
        this.EmpForm.controls.firstName.enable();
        break;

      case 'lastName':
        this.EmpForm.controls.lastName.enable();
        break;

      case 'email':
        this.EmpForm.controls.email.enable();
        break;

      case 'exSafetyEmail':
        this.EmpForm.controls.exSafetyEmail.enable();
        break;

      case 'SupervisorEmail':
        this.EmpForm.controls.supervisorEmail.enable();
        break;

      case 'departments':
        this.EmpForm.controls.title.value;
        break;

      case 'phoneNumber':
        this.EmpForm.controls.phoneNumber.enable();
        break;

      case 'Street':
        this.EmpForm.controls.street.enable();
        break;
      case 'safetySenstive':
        this.EmpForm.controls.isSafetySensitive.enable();
        break;
      case 'status':
        this.EmpForm.controls.status.enable();
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
  allUsersStatus: any[] = [];
  getUserstatus() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetUserStatus)
      .then((x: any) => {
        if (x) {
          this.allUsersStatus = x;
        }
      })
      .catch((x) => { });
  }
  //check supervisor email and selectedDepartmentIds
  updateData() {
    this.userModel;
    let data: any = {
      ...this.userModel,
      Id: this.currentUserId,
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
      IsSafetySensitive: this.EmpForm.controls.isSafetySensitive.value,
      ExSafetyEmail: this.EmpForm.controls.exSafetyEmail.value,
      userStatusID: this.EmpForm.controls.status.value,
      supervisorEmail: this.EmpForm.controls.supervisorEmail.value,
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

  currentNodeShow: any;
  showNode(val: any) {
    this.currentNodeShow = null;
    this.currentNodeShow = val;
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
        }/${val.id}/${this.currentUserId}`
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
    this.userCredentials.GetUserCredentials();
  }

  setDataForHistory() {
    this.historyList.forEach((element: any) => {
      element.companyCourse = this.langService.simplifyData(
        element.companyCourse,
        this.languagePreference
      );
    });
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

  //this function is used to get the history tab data
  GetHistoryList() {
    this.crudService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetUserCourseHistoriesByUser}/${this.currentUserId
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
        this.paginationArray = getPagenation(this.historyDataSource.data.length);
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
        this.currentUserId
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
      if (matches != null) {
        if (matches < 30) return (returnValue = false);
      } else {
        // No Digits found in the string.
      }
      return (returnValue = true);
    } else return false;
  }

  updateDate: Date = new Date();
  credentialID: number = 0;
  currentElementEdit: any;
  openModaladdSupplier(val: any) {
    this.currentElementEdit = val;
    this.updateDate = new Date(val.nextDueDateOverride);
    this.credentialID = val.credentialID;
    this.addSupplier.nativeElement.style.display = 'block';
  }

  closeaddSupplier() {
    this.addSupplier.nativeElement.style.display = 'none';
  }
  updateDateOfTrainingPLan(val: any) {
    let data: any = {
      credentialID: this.credentialID,
      nextDueDateOverride: new Date(val),
    };
    this.crudService
      .post(
        `${this.baseUrl +
        ApiEndpointType.UpdateUserTrainingPlanNextDueDateOverride
        }`,
        data
      )
      .then((x: any) => {
        if (x) {
          this.toastr.success(x.message, 'SUCCESS');
        }
        this.showNode(this.currentNodeShow);
        this.closeaddSupplier();
      })
      .catch((x) => {
        if (x) this.toastr.error(x.error, 'ERROR');
        this.closeaddSupplier();
      });
  }
  DeleteUserTrainingPlans(val: any) {
    if (confirm('Are you sure you want to delete?')) {
      this.crudService
        .getAll(
          `${this.baseUrl + ApiEndpointType.DeleteUserTrainingPlans}/${val.credentialID
          }`
        )
        .then((x: any) => {
          if (x) {
            this.toastr.success(x.message, 'SUCCESS');
            this.showNode(this.currentNodeShow);
          }
        })
        .catch((x) => {
          if (x) this.toastr.error(x.error, 'ERROR');
        });
    }
  }
  //function is to open the admin modal
  openModalforCourses(val: any) {
    if (val) {
      // let filterData:any = this.allCompanyUsers.filter(x=>x.firstName!=null);
      // filterData = filterData.filter((x:any)=>x.lastname!=null);
      // if(filterData.length==0)
      //  {
      //     this.toastr.info('No active employee to show.');
      //     return;
      //  }
      const dialogRef = this.dialog.open(AddCoursesMOdalComponent, {
        data: val,
      });
      dialogRef.afterClosed().subscribe((x: any) => {

        let ArrayData: any[] = [];
        if (x) {
          x.forEach((element: any) => {
            let data: any = {
              applicationUser: null,
              applicationUserID: this.currentUserId,
              companyCourse: null,
              companyCourseID: 1048,
              courseID: null,
              credentialID: null,
              dateOverride: null,
              isOverdueDate: false,
              name: null,
              nextDueDateOverride: null,
              nextDueDateOverrideDayDifference: null,
              strDeuOverDueDate: '',
            };
            data.companyCourseID = element.companyCourseID;
            ArrayData.push(data);
          });
        }

        if (ArrayData.length > 0) {
          this.addCompanyCourses(ArrayData);
        }
      });
    }
  }
  addCompanyCourses(val: any) {
    this.crudService
      .post(this.baseUrl + ApiEndpointType.AddUserTrainingPlans, val)
      .then((x: any) => {
        if (x) this.toastr.success(x.message, 'SUCCESS');
        this.showNode(this.currentNodeShow);
      })
      .catch((x) => {
        if (x) this.toastr.error(x.error, 'ERROR');
      });
  }
  GetCompanyCoursesById() {
    this.crudService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetCompanyCoursesById}/${this.currentUserId
        }`
      )
      .then((x: any) => {
        if (x) {
          x.companyCourseModelList.forEach((element: any) => {
            element.course = this.langService.simplifyData(
              element.course,
              this.languagePreference
            );
          });
          this.openModalforCourses(x);
        }
      })
      .catch((x) => { });
  }

  resendInvitation() {
    let data: any = {
      email: this.userModel.email,
      baseUri: environment.baseUri,
    };

    this.crudService
      .post(
        this.baseUrl + ApiEndpointType.ResendEmailInvitation,
        data
      )
      .then((x: any) => {
        if (x && x.message) {
          this.toastr.success(x.message, 'SUCCESS');
        }
      })
      .catch((x) => { });
  }

  UpdatePassword(val: any) {
    const dialogRef = this.dialog.open(AdminUpdatePasswordComponent, {
      data: val,
    });
  }
}
