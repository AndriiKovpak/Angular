import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  baseUrl: string = environment.apiBase;
  hide: boolean = true;
  loginFailed: boolean = false;

  constructor(
    private fromBuilder: FormBuilder,
    private authService: AuthService,
    public dataService: CrudService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private route: ActivatedRoute
  ) {
    this.switchLanguage();
    this.intializeFOrm();
    setTimeout(() => {
      this.route.params.subscribe((params: Params) => {
        if (params && params.id) {
          localStorage.setItem('EX', JSON.stringify(params));
          this.loginForm.get('username')?.patchValue(params.id);
        } else {
          localStorage.setItem('EX', '');
        }
      });
    }, 1000);
    localStorage.setItem('EX', '');
    this.authService.userInfo$.subscribe(res => {
      if (res && res.languagePreference) {
        this.translate.setDefaultLang(res.languagePreference);
        localStorage.setItem(
          'lang',
          res.languagePreference.trim().toLowerCase()
        );
      } else localStorage.setItem('lang', 'en');

      if (localStorage.getItem('EX')) {
        let data = JSON.parse(localStorage.getItem('EX') ?? '');
        if (data != '') this.redirect(data.id2.split('-')[1]);
        return;
      }
      if (res?.role) {
        let roleArray = res.role.split(',').map(e => e.toLowerCase());
        if (roleArray.includes('admin')) {
          this.router.navigate(['/admin/dashboard-admin']);
        }
        // else if (roleArray.includes('user')) {
        //   this.router.navigate(['/employee-home/companies']);
        // }
        else {
          this.router.navigate(['/companyadmin/main-page']);
        }
      }
    })
  }
  intializeFOrm() {
    this.loginForm = this.fromBuilder.group({
      username: [
        '',
        [
          Validators.required,
        ],
      ],
      password: ['', { Validators: [Validators.required] }],
    });
  }
  loginForm: FormGroup = this.fromBuilder.group({
    username: [
      '',
      [
        Validators.required,
      ],
    ],
    password: ['', { Validators: [Validators.required] }],
  });

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  public onLoginSubmit() {
    this.loginFailed = false;
    if (this.loginForm.invalid) {
      return;
    }
    let username = this.loginForm.controls.username.value;
    let password = this.loginForm.controls.password.value;
    this.authService.login(username, password);

    this.authService.onLogging.subscribe((result) => {
      if (result) {
        this.loginFailed = true;
      }
    });
  }

  redirect(val: string) {
    this.router.navigate(['/employee-home/course', { id: val }]);
  }

  overDueCount: number = 0;
  //get over due count
  getOverDueCount() {
    this.ngxLoader.stopAll();
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetOverDueCount)
      .then((x) => {

      })
      .catch((x) => { });
  }
}
