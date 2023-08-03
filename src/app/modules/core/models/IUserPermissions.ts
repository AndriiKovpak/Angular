import {CalibrationModulePermission} from "./CalibrationModulePermission";

export interface IUserPermissions {
  calibrationPermissions: {[key in CalibrationModulePermission]?: boolean};
}
