import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  VERSION,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { AuthService } from '../../guards/auth.service';
import { MustMatch } from '../../_helpers/must-match.validator';
import { admin } from './model/admin-user.model';

@Component({
  selector: 'app-admin-users-add',
  templateUrl: './admin-users-add.component.html',
  styleUrls: ['./admin-users-add.component.scss'],
})
export class AdminUsersAddComponent implements OnInit, AfterViewInit {
  @ViewChild('departmentInput') departmentInput!: ElementRef<HTMLInputElement>;

  breakpoint: any;
  event: any;
  EmpForm!: FormGroup;
  submitted: boolean = false;
  baseUrl: string = environment.apiBase;

  addUser!: admin;

  //this are used to select the departments
  addingSelectedDepartments: any[] = [];
  selectedDepartent: any;
  allDepartments: any[] = [];
  allChips: string[] = [];
  departments: any[] = [];

  //this are used to select roles
  selectedRole: any;
  selectedStatus: any;
  roles: any[] = [];
  rolesForCalibration: any[] = [];
  type: string = '';

  //multi selected
  departmentChips: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  departmentCtrl = new FormControl();
  filteredDepartments!: Observable<string[]>;
  userDetails: any
  userInfo: any;
  isNew = true;

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private dailog: MatDialog,
    private toaster: ToastrService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (this.data && this.data.type) {
      this.type = this.data.type;
    }
    this.userInfo = this.authService.getUserInformation();

    this.GetUserDetailById()

  }

  ngAfterViewInit(): void {
    this.GetCompanySelectList();
    this.GetRoleSelectList();
  }

  ngOnInit(): void {
    this.intializeForm();
  }

  intializeForm() {
    if (this.data == null) {
      this.isNew = true;
      this.EmpForm = this.formBuilder.group(
        {
          companyID: new FormControl(null),
          role: new FormControl(''),
          title: new FormControl('', [Validators.required]),
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required, Validators.email]),
          phoneNumber: new FormControl('', [Validators.required]),
          street: new FormControl('', [Validators.required]),
          city: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required]),
          state: new FormControl('', [Validators.required]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    }
    else {
      this.isNew = false;
      this.EmpForm = this.formBuilder.group(
        {
          id: new FormControl(this.data?.Id ?? ''),
          companyID: new FormControl(null),
          role: new FormControl(this.data?.Role ?? ''),
          title: new FormControl(this.data?.Title ?? '', [Validators.required]),
          firstName: new FormControl(this.data?.FullName?.split(' ')[0] ?? '', [Validators.required]),
          lastName: new FormControl(this.data?.FullName?.split(' ')[1] ?? '', [Validators.required]),
          email: new FormControl(this.data?.Email ?? '', [ Validators.email]),
          phoneNumber: new FormControl(this.data?.PhoneNumber ?? '', []),
          street: new FormControl(this.data?.Street ?? '', []),
          city: new FormControl(this.data?.City ?? '', []),
          zipCode: new FormControl(this.data?.ZipCode ?? '', []),
          state: new FormControl(this.data?.State ?? '', []),
        }
      );
    }
    this.selectedRole = this.data?.Role;
    this.onRolesSelected(this.data?.Role);
    this.selectedStatus = this.data?.UserStatus;
  }
  modalClose() {
    this.dailog.closeAll();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.EmpForm.controls;
  }

  //this function is used to update the data
  Update() {
    this.submitted = true;
    if (this.EmpForm.invalid) {
      return;
    }
  }

  //this function is used to get selected companies
  GetRoleSelectList() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetRoleSelectList)
      .then((x: any) => {

        if (x) {
          this.roles = x;
          if (this.type == 'calibration') {
            x.forEach((element: any) => {
              if (element.value == "Admin" || element.value == "Supplier" || element.value == "Read") {
                this.rolesForCalibration.push(element)
              }
            });
          }
        }
      })
      .catch((x) => { });
  }

  //this function is used to get selected companies
  GetCompanySelectList() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetCompanySelectList)
      .then((x: any) => {
        if (x) {
          this.departments = x;
          if (this.data?.Company != null) {
            this.selectedDepartent = this.departments.filter(x => x.text == this.data?.Company)[0].value;
            this.onDepartmentSelected(this.selectedDepartent);
          }
        }
      })
      .catch((x) => { });
  }

  //get department by company
  GetDepartmentSelectListByCompany(val: any) {
    // this.service.getBlobSingleWithParams(`${this.baseUrl + ApiEndpointType.DownloadCompanyAdminUserCourseTraningMatrixReport}/${isCustomCourse}`)
    this.crudService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetDepartmentSelectListByCompany
        }/${val}`
      )
      .then((x: any) => {
        if (x) {
          this.allDepartments = x;
          this.departmentChips = [];

          x.forEach((element: any) => {
            this.allChips.push(element.text);
          });

          if (this.data?.SelectedDepartmentIds != null) {
            this.departmentChips = [];
            this.addingSelectedDepartments = [];
            this.data?.SelectedDepartmentIds.forEach((element: any) => {
              let data = this.allDepartments.find((x: any) => x.value == element);
              if (data) {
                this.departmentChips.push(data.text);
                this.addingSelectedDepartments.push(data.value);
              }
            });
          }
          this.filteredDepartments = this.departmentCtrl.valueChanges.pipe(
            startWith(null),
            map((department: string | null) =>
              department ? this._filter(department) : this.allChips.slice()
            )
          );
        }
      })
      .catch((x) => { });
  }

  showCompanies: boolean = false;
  showDepartment: boolean = false;
  //role selection
  onRolesSelected(val: any) {
    this.showCompanies = false;
    this.showDepartment = false;
    if (this.selectedRole == 'CompanyAdmin') {
      this.showCompanies = true;
      this.showDepartment = false;
    }
    if (this.selectedRole == 'Admin') {
      this.showCompanies = false;
      this.showDepartment = false;
    }
    if (this.selectedRole == 'User') {
      this.showCompanies = true;
      this.showDepartment = true;
    }
  }

  /**
   * onDepartmentSelected
   */
  public onDepartmentSelected(val: any) {
    this.GetDepartmentSelectListByCompany(this.selectedDepartent);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allChips.filter(
      (department) => department.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  //this function is use to save the data
  Save() {
    this.submitted = true;
    if (this.EmpForm.invalid) {
      this.EmpForm.markAllAsTouched();
      this.submitted = false;
      return;
    }
    this.addUser = this.EmpForm.value;

    this.addUser['SelectedDepartmentIds'] = this.addingSelectedDepartments;
    this.addUser.role = this.selectedRole;
    this.addUser.companyID = this.userDetails.userModel.companyID;
    this.addUser.userStatusName = this.selectedStatus;

    this.addUser['fullName'] = this.addUser.firstName + ' ' + this.addUser.lastName;
    if (this.addUser.id == null) {
      this.crudService
        .post(this.baseUrl + ApiEndpointType.SaveUserDetails, this.addUser)
        .then((x: any) => {
          if (x.message) {
            this.toaster.success(x.message, 'SUCCESS');
            this.modalClose();
          }
        })
        .catch((x: any) => {

          if (x.error) {
            this.toaster.error(x.error, 'ERROR');
          }
          this.submitted = false;
        });
    }
    else {
      this.crudService
        .post(this.baseUrl + ApiEndpointType.UpdateUserDetail, this.addUser)
        .then((x: any) => {
          if (x && x.message) {
            this.toaster.success(x.message, 'SUCCESS');
            this.modalClose();
          }
          this.EmpForm.disable();
        })
        .catch((x) => {
          if (x.error) {
            this.toaster.error(x.error, 'ERROR');
          }
          this.submitted = false;
        });
    }
  }

  // to get the selected departments
  getSelectedDepartment(val: string) {
    let filterDepartments: any;
    filterDepartments = this.allDepartments.find((x) => x.text == val);
    if (filterDepartments)
      this.addingSelectedDepartments.push(filterDepartments.value);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.viewValue;
    let data: any = this.allDepartments.find(
      (x) => x.text == event.option.viewValue
    );
    if (data) {
      this.addingSelectedDepartments.push(data.value);
    }

    if (this.departmentChips.includes(newValue)) {
      this.departmentChips = [...this.departmentChips.filter((fruit) => fruit !== newValue)];
    } else {
      this.departmentChips.push(event.option.viewValue);
    }
    this.departmentInput.nativeElement.value = '';
    this.departmentCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add
    if ((value || '').trim()) {
      this.departmentChips.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.departmentCtrl.setValue(null);
  }

  remove(fruit: string): void {
    let data: any = this.allDepartments.find((x) => x.text == fruit);
    if (data) {
      this.addingSelectedDepartments =
        this.addingSelectedDepartments.filter(
          (x: any) => x != data.value
        );
    }
    const index = this.departmentChips.indexOf(fruit);
    if (index >= 0) {
      this.departmentChips.splice(index, 1);
    }
  }


  //Get User Detail By Id
  GetUserDetailById() {
    this.crudService.getAll(this.baseUrl + ApiEndpointType.GetUserDetailById + '/' + this.userInfo.userId).then((x: any) => {
      if (x)
        this.userDetails = x
    }).catch(x => {

    })
  }
}
