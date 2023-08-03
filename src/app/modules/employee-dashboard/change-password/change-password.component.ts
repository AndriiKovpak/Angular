import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MustMatch } from '../../core/_helpers/must-match.validator';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  baseUrl: string = environment.baseUri;
  resetpassword: any;

  constructor(
    private fromBuilder: FormBuilder,
    private dataService: CrudService,
    private auth: AuthService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private noti: NotificationService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  setFormValue() {
    this.resetpassword = this.fromBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
        ]),
        passwordConfirm: new FormControl('', [Validators.required]),
        currentPassword: new FormControl('', [Validators.required])
      },
      {
        validator: MustMatch('password', 'passwordConfirm'),
      }
    );
  }

  get f() {
    return this.resetpassword.controls;
  }

  ngOnInit(): void {
    this.setFormValue();
  }

  submit() {

    if (this.resetpassword.invalid) {
      return;
    }

    this.ngxLoader.start();

    this.dataService
      .post(
        environment.apiBase +  ApiEndpointType.ChangePassword,
        this.resetpassword.value
      )
      .then((x: any) => {
        this.closeModal();
        this.noti.showSuccess(x.message, 'SUCCESS');
        this.ngxLoader.stop();
      })
      .catch((x) => {
        this.toastr.error(x.error, 'ERROR');
        this.setFormValue();
        this.ngxLoader.stop();
      });
  }
}
