import { Injectable } from '@angular/core';
import {CrudService} from "../genric-service/crudservice";
import {BehaviorSubject, Observable} from "rxjs";
import {IUserInfo} from "../models/IUserInfo";
import {environment} from "../../../../environments/environment";
import {IUserPermissionsDto} from "../models/IUserPermissionsDto";
import {IUserPermissions} from "../models/IUserPermissions";
import {IChangePasswordDto} from "../models/IChangePasswordDto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.apiBase;

  private userInfo = new BehaviorSubject<IUserInfo | null>(null);

  constructor(
    private crudService: CrudService
  ) { }

  getUserInfo(): Observable<IUserInfo | null> {
    if (this.userInfo.value === null) {
      this.crudService
        .getAll<IUserInfo>(this.baseUrl + '/api/Authorize/user')
        .then(res => {
          this.userInfo.next(res);
        });
    }
    return this.userInfo;
  }

  getUserPermissions$(): Observable<IUserPermissions | null> {
    return this.crudService.getAll$<IUserPermissionsDto>(this.baseUrl + '/api/User/my-permissions');
  }
}
