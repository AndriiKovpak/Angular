import {CalibrationModulePermission} from "./CalibrationModulePermission";

export interface IUserPermissionsDto {
  calibrationPermissions: {[key in CalibrationModulePermission]?: boolean};
}
