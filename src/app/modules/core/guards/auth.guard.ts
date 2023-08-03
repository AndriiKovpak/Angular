import {UserService} from "../services/user.service";

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import {map} from "rxjs/operators";
import {CalibrationModulePermission} from "../models/CalibrationModulePermission";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.loggedIn();
        if (currentUser) {
            // logged in so return true
            const requiresCalibrationPermissions = route.data.requiresCalibrationPermissions as CalibrationModulePermission[];
            if (requiresCalibrationPermissions && requiresCalibrationPermissions.length > 0){
              return this.userService.getUserPermissions$().pipe(map(permissions => {
                return requiresCalibrationPermissions.reduce((prev, current) =>
                    prev && permissions?.calibrationPermissions[current]!
                  , true);
              }));
            }
            return true;
        } else {
          // not logged in so redirect to login page with the return url
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
    }
}
