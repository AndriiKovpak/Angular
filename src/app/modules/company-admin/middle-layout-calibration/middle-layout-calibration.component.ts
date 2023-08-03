import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/guards/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { AddNewEmployeeComponent } from '../add-new-employee/add-new-employee.component';
import {UserService} from "../../core/services/user.service";
import {IUserPermissions} from "../../core/models/IUserPermissions";

@Component({
  selector: 'app-middle-layout-calibration',
  templateUrl: './middle-layout-calibration.component.html',
  styleUrls: ['./middle-layout-calibration.component.scss'],
})
export class MiddleLayoutCalibrationComponent implements OnInit {
  userInfo: any;
  //
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    public translate: TranslateService,
    public translationService: TranslationService,
    public userService: UserService
  ) {}
  userPermissions: IUserPermissions = {calibrationPermissions:{}};
  roleAdmin: boolean = false;
  roleSupplier: boolean = false;
  roleRead: boolean = false;

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInformation();
    if(this.userInfo?.role) {
      let roleArray = (this.userInfo.role as string).split(',').map(e => e.toLowerCase());
      this.roleAdmin = roleArray.includes("companyadmin");
      this.roleRead = roleArray.includes('read');
    }
  }
}
