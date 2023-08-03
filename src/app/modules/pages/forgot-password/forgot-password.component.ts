import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpassword: any;

  constructor
    (
      private fromBuilder: FormBuilder,
      private router: Router,
      private dataService: CrudService,
      private auth: AuthService,
      private ngxLoader: NgxUiLoaderService,
      private toastr: ToastrService,
      private noti: NotificationService
    ) { }

  setFormValue() {
    this.forgotpassword = this.fromBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      baseUri: environment.baseUri,
    })
  }

  get f() {
    return this.forgotpassword.controls;
  }
  ngOnInit(): void {
    this.setFormValue();
  }

  submit() {
    if (this.forgotpassword.invalid) {
      return;
    }
    this.ngxLoader.start();
    this.dataService.post(environment.apiBase + '/api/Authorize/forgotPassword', this.forgotpassword.value).then((x: any) => {
      this.noti.showSuccess(x.message, 'SUCCESS')
      this.setFormValue();
      this.ngxLoader.stop();
      this.router.navigate(['/']);
    }).catch(x => {
      this.toastr.error(x.error, 'ERROR');
      this.setFormValue();
      this.ngxLoader.stop();
    })
  }
}
