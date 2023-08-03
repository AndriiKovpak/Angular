import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { MustMatch } from '../../_helpers/must-match.validator';

@Component({
  selector: 'app-admin-update-password',
  templateUrl: './admin-update-password.component.html',
  styleUrls: ['./admin-update-password.component.scss'],
})
export class AdminUpdatePasswordComponent implements OnInit {
  baseUrl: string = environment.apiBase;
  registerForm!: FormGroup;
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dataService: CrudService,
    public toaster: ToastrService,
    public matDailog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }
  get f() {
    return this.registerForm.controls;
  }
  ModalClose() {
    const dialogRef = this.dialog.closeAll();
  }
  Save() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched()
      return;
    }

    let data:any={
      password: this.registerForm.controls.password.value,
      passwordConfirm: this.registerForm.controls.confirmPassword.value,
      userId: this.data.Id ?? this.data.id,
    }
    this.submitted = true;
    this.dataService.post(this.baseUrl+ApiEndpointType.UpdatePassword,data)
    .then((x:any)=>{
      if(x)
      this.toaster.success(x.message,'SUCCESS')
    })
    .catch(x=>{
      this.toaster.error(x.error,'ERROR')
    })
    this.matDailog.closeAll()
  }
}
