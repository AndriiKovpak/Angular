import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MustMatch } from '../../core/_helpers/must-match.validator';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

 baseUrl:string = environment.baseUri;
 resetpassword : any;

  constructor
  (
    private fromBuilder : FormBuilder,
    private router: Router,
    private dataService: CrudService,
    private auth:AuthService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private noti: NotificationService,
    private route: ActivatedRoute,
  ) { }

  setFormValue(){
    this.resetpassword  = this.fromBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40),
      ]),
      passwordConfirm: new FormControl('', [Validators.required]),
      userId: new FormControl('',[
        Validators.required
      ]),
      token: new FormControl('',[
        Validators.required
      ]),
      baseUri: environment.baseUri,
    },
    {
      validator: MustMatch('password', 'passwordConfirm'),
    }
    );
  }

  get f()
  {
    return this.resetpassword.controls;
  }
  ngOnInit(): void {
    this.setFormValue();
    this.route.params.subscribe((params: Params) => {
      if (params && params.userId) {
        this.resetpassword.controls.userId.patchValue(params.userId);
      }
    });
    if(window.location.href.split('=')[1]){
    this.resetpassword.controls.token.patchValue(window.location.href.split('=')[1].replaceAll("%20", "+").replaceAll("%2F", "/"))
    }
    else{
     this.noti.showError("Reset Token is Missing.", "ERROR");
    }
  }

  submit()
  {
    if (this.resetpassword.invalid) {
      return;
    }
    this.ngxLoader.start();

    this.dataService.post(environment.apiBase + ApiEndpointType.ResetPassword, this.resetpassword.value).then((x: any)=>{
      this.router.navigate(['/login']);
    this.noti.showSuccess(x.message,'SUCCESS')
    this.ngxLoader.stop();
    }).catch(x=>{
      this.toastr.error(x.error,'ERROR');
      this.setFormValue();
      this.ngxLoader.stop();
    })
  }
}
