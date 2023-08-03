import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../guards/auth.service';
import { I } from '@angular/cdk/keycodes';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {first, mergeMap} from "rxjs/operators";


@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService, public ngxLoader: NgxUiLoaderService,) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (request.url.includes('GetAllCompanyAdminUserswithPagingAndFilters') || request.url.includes('getOverDueCount') ) {
      this.ngxLoader.stop()
      this.ngxLoader.stopAll()
    }
    return this.authenticationService.user$.pipe(first(),
      mergeMap(currentUser => {
        if (currentUser && currentUser.token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`,
              'X-test': ':)'
            }
          });
        }
        // else {
        //
        //   let data = window.location.href;
        //   if(!(data.includes('login')
        //     ||  data.includes('about')
        //     ||  data.includes('termsofuse')
        //     ||  data.includes('privacypolicy')
        //     ||  data.includes('resetpassword')
        //     ||  data.includes('forgotPassowrd')
        //     ||  data.includes('buy')
        //     ||  data.includes('invite')
        //     ||  data.includes('contact-us')
        //     ||  data.includes('registration'))) {
        //       this.authenticationService.logout();
        //   }
        // }
        return next.handle(request);
      }))


  }
}
