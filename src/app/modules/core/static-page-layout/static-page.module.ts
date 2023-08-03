import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticHeaderComponent } from './static-header/static-header.component';
import { StaticFooterComponent } from './static-footer/static-footer.component';
import { StaticPageLayoutComponent } from './static-page-layout.component';
import { RouterModule } from '@angular/router';
import { faChalkboardTeacher, faHome, faPlaneDeparture, faHeadset, faSignInAlt, faShoppingCart, faGraduationCap, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    StaticHeaderComponent,
    StaticFooterComponent,
    StaticPageLayoutComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        TranslateModule

    ],
  exports: [
    StaticPageLayoutComponent,
]
})
export class StaticPageModule {
  constructor(library: FaIconLibrary){
    library.addIcons(faChalkboardTeacher, faHome, faPlaneDeparture, faHeadset, faSignInAlt, faShoppingCart, faGraduationCap, faBriefcase );
  }
 }
