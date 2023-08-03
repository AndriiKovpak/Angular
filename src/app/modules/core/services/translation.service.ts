import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class TranslationService {

    private _onLanguageChange: BehaviorSubject<any>;

    constructor(){
        this._onLanguageChange = new BehaviorSubject(null);

    }

    public setLanguage(lang: string) {

        this._onLanguageChange.next(lang);
    }

    get onLanguageChange(): Observable<string> {

        return this._onLanguageChange.asObservable();
    }
  }
