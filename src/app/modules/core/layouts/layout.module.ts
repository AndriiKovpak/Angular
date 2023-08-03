import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faChalkboardTeacher, faHome, faPlaneDeparture, faHeadset, faSignInAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
    declarations: [
        LayoutComponent,
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpTranslateLoader,
            deps: [HttpClient],
          },
          isolate:false,
          extend:true
        })
    ],
    exports: [
        LayoutComponent,
    ]
})
export class LayoutModule {
  constructor(library: FaIconLibrary, private translate: TranslateService){
    library.addIcons(faChalkboardTeacher, faHome, faPlaneDeparture, faHeadset, faSignInAlt, faShoppingCart);
    this.translate.addLangs(['en','es']);
    let currentLang = localStorage.getItem('lang');
    this.translate.setDefaultLang(currentLang??'en');
  }
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
