import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ChangePasswordComponent } from 'src/app/modules/employee-dashboard/change-password/change-password.component';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { AuthService } from '../../guards/auth.service';
import { IUserInfo } from '../../models/IUserInfo';
import { TranslationService } from '../../services/translation.service';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-static-header',
  templateUrl: './static-header.component.html',
  styleUrls: ['./static-header.component.scss'],
})
export class StaticHeaderComponent implements OnInit {
  home: boolean = false;
  about: boolean = false;
  contact: boolean = false;
  product: boolean = false;
  language: string[] = [];
  loggedIn = false;
  baseUrl: string = environment.apiBase;
  currentLanguage: string = "ENGLISH";
  userInfo: any;
  disableProfileClick = false;
  userInfo$!: Observable<IUserInfo | null>;

  constructor(
    public translate: TranslateService,
    public translationService: TranslationService,
    private scroll: ViewportScroller,
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog,
    private service: CrudService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }
  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event: any) {
    this.pageYoffset = window.pageYOffset;
  }

  ngOnInit(): void {
    this.switchLanguage();
    this.translate.setDefaultLang(localStorage.getItem('lang') || 'en');
    this.userInfo$ = this.auth.userInfo$;
    this.userInfo = this.auth.getUserInformation();
    this.loggedIn = this.auth.loggedIn();
    this.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.userInfo = userInfo;
        this.disableProfileClick = this.userInfo.role === "Read";
      }
    })
    this.getlangs();
  }
  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent);
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  Clicked(val: string) { }
  switchLang(lang: string) {
    this.currentLanguage = lang.toUpperCase();

    if (lang == 'English') {
      localStorage.setItem('lang', 'en');

      this.translationService.setLanguage('en');
    } else {
      localStorage.setItem('lang', 'es');

      this.translationService.setLanguage('es');
    }
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  getlangs() {
    this.language = [];
    this.translate.getLangs().forEach((element: any) => {
      if (element == 'en') this.language.push('English');
      else this.language.push('español ');
      this.language = this.language.filter((value, index) => this.language.indexOf(value) === index);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onError(event: any) {
    event.target.src = "/assets/images/icons/User.svg"
  }

  navigate() {
    if (this.userInfo.role) {
      if (
        this.userInfo.role
          .split(',')
          .filter((x: any) => x.trim().toLowerCase() == 'user')[0]
          ?.trim()
          .toLowerCase() == 'user'
      )
        this.router.navigate(['/employee-home/companies']);
      else if (
        this.userInfo.role
          .split(',')
          .filter((x: any) => x.trim().toLowerCase() == 'admin')[0]
          ?.trim()
          .toLowerCase() == 'admin'
      )
        this.router.navigate(['/admin/dashboard-admin']);
      else this.router.navigate(['/companyadmin/main-page']);
    } else {
      this.toastr.error("This user have not any role.", 'ERROR');
    }
  }
}
