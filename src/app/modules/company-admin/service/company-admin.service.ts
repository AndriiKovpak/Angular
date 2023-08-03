import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import {ApiEndpointType} from "../../shared/enums/api.routes";
import {map, startWith} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {ISelectListItem} from "../../core/models/ISelectListItem";

@Injectable({
  providedIn: 'root'
})
export class CompanyAdminService {

  private departmentSelectListDict: {[key:string]: BehaviorSubject<ISelectListItem[]>} = {};
  private baseUrl: string = environment.apiBase;

  constructor(
    private crudService: CrudService,
  ) {

  }

  //get department by company
  GetDepartmentSelectListByCompany(companyId: number) : Observable<ISelectListItem[]>  {
    if (!this.departmentSelectListDict[companyId]) {
      this.departmentSelectListDict[companyId] = new BehaviorSubject<ISelectListItem[]>([]);

      this.crudService
        .getAll<ISelectListItem[]>(
          `${
            this.baseUrl + ApiEndpointType.GetDepartmentSelectListByCompany
          }/${companyId}`
        )
        .then((x) => {
          this.departmentSelectListDict[companyId].next(x);
        })
        .catch((x) => {});
    }


    return this.departmentSelectListDict[companyId];
  }

}
