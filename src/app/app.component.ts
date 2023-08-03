import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myex';

  constructor(public translate: TranslateService){
    this.translate.addLangs(['en','es']);
    this.translate.setDefaultLang('en');
  }

}

