import { Injectable } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { ITextLang } from "../models/ITextLang";

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(public translationService: TranslationService) { }
  simplifyData(value: any, language: string): string {
    return value?.find(
      (x: any) =>
        x.langcode.trim().toLowerCase() == language.trim().toLowerCase()
    )?.value;
  }

  getItemForSelectedLanguage(value: ITextLang[], language: string): ITextLang {
    return value.find(
      (x: any) =>
        x.langcode.trim().toLowerCase() == language.trim().toLowerCase()
    ) ?? value[0];
  }

  postDataAccordingToLanguage(
    objectArray: any,
    language: string,
    value: string
  ) {
    let data: any[] = [
      {
        langcode: '',
        value: '',
      },
    ];
    data = objectArray;

    let filterDataAccordingLang = data.find(
      (x: any) =>
        x.langcode.trim().toLowerCase() == language.trim().toLowerCase()
    );
    filterDataAccordingLang.value = value;
    let filterDataNotSameLang = data.find(
      (x: any) =>
        x.langcode.trim().toLowerCase() !== language.trim().toLowerCase()
    );
    data = [];
    data.push(filterDataAccordingLang);
    data.push(filterDataNotSameLang);
  }

  addDataAccordingToLanguage(element: any, language: string, value: string) {
    element.find((x: any) => x.langcode == language).value = value;
    return element;
  }

  createFormat(val: string, languge: string) {
    let description: any[] = [
      { langcode: 'en', value: '' },
      { langcode: 'es', value: '' },
    ];
    description.find((x) => x.langcode == languge).value = val;
    return description;
  }
  switchLang(lang: string) {
    if (lang == 'English') {
      this.translationService.setLanguage('en');
    } else {
      this.translationService.setLanguage('es');
    }
  }
  formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  convertLangValueObject(val: Array<any> | null, fill = true) {
    let returnValue: any = {};
    if (val == null) {
      return {
        en: '',
        es: ''
      }
    } else {
      let defaultValue = "";
      if(fill) {
        defaultValue = val.find(e => !!e.value)?.value || "";
      }
      val.forEach(elem => {
        returnValue[elem.langcode] = elem.value || defaultValue;
      })
      return returnValue;
    }
  }
  convertLangValueList(val: any | null) {
    if (val) {
      let returnValue: Array<Object> = [];
      Object.keys(val).forEach(elem => {
        returnValue.push({
          langcode: elem,
          value: val[elem]
        })
      })
      return returnValue;
    } else {
      return null;
    }
  }
}
