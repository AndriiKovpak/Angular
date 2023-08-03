export interface IUserInfo {
  isAuthenticated: boolean;
  displayUserName: string;
  userName: string;
  userId: string;
  exposedClaims: {[key:string]: string};
  profileImage: string;
  languagePreference: string;
  title: string;
  role: string;
  companyId: number;
}
