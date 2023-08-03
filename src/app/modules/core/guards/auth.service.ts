import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {concatMap, first, flatMap, map, mergeMap} from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IUserCredentialDto } from '../services/IUserCredentialDto';
import { Router } from '@angular/router';
import { IUserInfo} from "../models/IUserInfo";
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { CrudService } from '../genric-service/crudservice';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUserCredentialDto | null>(
    null
  );
  private currentUserInfo = new BehaviorSubject<IUserInfo | null>(null);
  public onLogging = new Subject<string>();

  constructor(private http: HttpClient,
    private router: Router,
    public dataService: CrudService) {
    const userString = localStorage.getItem('currentUser');
    const userInfoString = localStorage.getItem('userDetails');

    if (userString && userInfoString) {
      try {
        const user = JSON.parse(userString) as IUserCredentialDto;
        const userInfo = JSON.parse(userInfoString);
        const tokenDecodablePart = user.token.split('.')[1];
        const jwt = JSON.parse(
          Buffer.from(tokenDecodablePart, 'base64').toString()
        ) as any;
        if (jwt.exp > Date.now() / 1000) {
          this.currentUserSubject.next(user);
          this.currentUserInfo.next(userInfo);
        } else {
          this.logout();
        }
      } catch (e) {
        this.removeUserData();
      }
    } else {
      this.removeUserData();
    }
  }

  get user$() {
    return this.currentUserSubject.asObservable();
  }

  get userInfo$() {
    return this.currentUserInfo.asObservable();
  }

  login(email: string, password: string) {
    this.dataService.post(environment.apiBase + ApiEndpointType.Token, {
        email,
        password,
        utcOffset: new Date().getTimezoneOffset()
      })
      .then(
        (user: any) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.http
            .get<IUserInfo>(environment.apiBase + ApiEndpointType.AuthorizeUser)
            .subscribe((userInfo) => {
              localStorage.setItem('userDetails', JSON.stringify(userInfo));
              this.currentUserInfo.next(userInfo);
            });
        }
      )
      .catch((err: any) => {
        this.onLogging.next(err.error);
      });
  }

  impersonate(userId: string): Observable<IUserInfo | null> {
    return this.currentUserSubject.pipe(
      first(),
      concatMap((user) => {
        return this.http.get<IUserCredentialDto>(
          `${environment.apiBase}/api/Authorize/impersonate/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      }),
      concatMap((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return this.currentUserSubject.asObservable();
      }),
      concatMap((user) => {
        return this.http.get<IUserInfo>(
          `${environment.apiBase}/api/Authorize/user`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      }),
      concatMap((userInfo) => {
        localStorage.setItem('userDetails', JSON.stringify(userInfo));
        this.currentUserInfo.next(userInfo);
        return this.currentUserInfo.asObservable();
      })
    );
  }

  forgotPassword(email: string, baseUri: string) {
    return this.http.post<any>(
      `${environment.apiBase}/api/Authorize/forgotPassword`,
      { email, baseUri }
    );
  }

  removeUserData() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userDetails');
    this.currentUserSubject.next(null);
    this.currentUserInfo.next(null);
  }

  logout() {
    // remove user from local storage to log user out
    this.removeUserData();
    this.router.navigate(['']);
  }

  // this function is used to get user information
  getUserInformation() {
    return this.currentUserInfo.value;
  }

  loggedIn(): boolean {
    return this.currentUserInfo.value ? true : false;
  }
}
