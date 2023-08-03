import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
@Injectable({ providedIn: 'root' })
export class CrudService {

    constructor(private http: HttpClient) { }

    formatString(text: string, ...args: any[]) {
        const values: string[] = [];

        if (!args) {
            return text;
        }
        for (let i = 0; i < args.length - 0; i++) {
            values[i] = args[i + 0];
        }

        if (values.length === 0) {
            return text;
        }
        return text.replace(/\{(\d+)\}/g, function (str, val) {
            const value = values[parseInt(val)];
            if (
                value === null ||
                value === undefined ||
                value.toString().trim() === ''
            ) {
                return '';
            }
            return value.toString();
        });
    }

    public async getAll<T>(actionUrl: string): Promise<T> {
        return this.getAllWithParams<T>(actionUrl);
    }
    public getAll$<T>(actionUrl: string): Observable<T> {
        return this.getAllWithParams$<T>(actionUrl);
    }

    public async getAllWithParams<T>(actionUrl: string, ...rest: string[]): Promise<T> {
        return this.http.get<T>(this.formatString(actionUrl, rest)).toPromise();
    }
    public getAllWithParams$<T>(actionUrl: string, ...rest: string[]): Observable<T> {
        return this.http.get<T>(this.formatString(actionUrl, rest));
    }

    public getSingle<T>(actionUrl: string, id: any): Promise<T> {
        return this.getSingleWithParams<T>(actionUrl + '/{0}', id);
    }

    public getSingleWithParams<T>(actionUrl: string, ...rest: string[]): Promise<T> {
        return this.http.get<T>(this.formatString(actionUrl, rest)).toPromise()
    }

    public async post<T>(actionUrl: string, postData: any): Promise<T> {
        return this.postWithParams<T>(actionUrl, postData);
    }

    public post$<T>(actionUrl: string, postData: any): Observable<T> {
        return this.http.post<T>(actionUrl, postData);
    }

    public put$<T>(actionUrl: string, postData: any): Observable<T> {
        return this.http.put<T>(actionUrl, postData);
    }

    public delete$<T>(actionUrl: string): Observable<T> {
        return this.http.delete<T>(actionUrl);
    }

    public async postWithBody<T>(actionUrl: string, postData: any): Promise<T> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<T>(actionUrl, JSON.stringify(postData), {headers: headers}).toPromise();
    }

    public async postWithParams<T>(actionUrl: string, postData: any, ...rest: string[]): Promise<T> {
        return this.http.post<T>(this.formatString(actionUrl, rest), postData).toPromise();
    }

    public async update<T>(actionUrl: string, id: number, itemToUpdate: any): Promise<T> {
        return this.updateWithParams<T>(actionUrl + '/{0}', itemToUpdate, id.toString());
    }

    public async updateWithParams<T>(actionUrl: string, itemToUpdate: any, ...rest: string[]): Promise<T> {
        return this.http.put<T>(this.formatString(actionUrl, rest), itemToUpdate).toPromise();
    }

    public async delete<T>(actionUrl: string, id: number): Promise<T> {
        return this.deleteWithParams<T>(actionUrl + '/{0}', id.toString());
    }
    public async deleteRecord<T>(actionUrl: string): Promise<T> {
        return this.http.delete<T>(actionUrl).toPromise();
    }


    public async deleteWithGuid<T>(actionUrl: string, id: string): Promise<T> {
        return this.deleteWithParams<T>(actionUrl + '/{0}', id);
    }

    public async deleteWithParams<T>(actionUrl: string, ...rest: string[]): Promise<T> {
        return this.http.delete<T>(this.formatString(actionUrl, rest)).toPromise();
    }

    public async postFormData<T>(actionUrl: string, model: FormData): Promise<T> {
        return this.http.post<T>(actionUrl, model).toPromise();
  }

    public getBlobSingleWithParams<T>(actionUrl: string): Promise<any> {
        return this.http.get(actionUrl, {responseType: 'blob'}).toPromise()
    }

    public getBlobSingleWithParamsAndBody<T>(actionUrl: string, postData: any): Promise<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      return this.http.post(actionUrl, JSON.stringify(postData), {headers: headers, responseType: 'blob'}).toPromise()
    }
}
