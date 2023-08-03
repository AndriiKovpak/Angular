import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Objectpass {
  public _object: BehaviorSubject<any>;
  public penColor: BehaviorSubject<any>;

  constructor() {
    this._object = new BehaviorSubject(null);
    this.penColor = new BehaviorSubject(null);
  }

  public setObject(obj: any) {
    this._object.next(obj);
  }
  public setColor(color: any) {
    this.penColor = new BehaviorSubject(color);
  }
}
