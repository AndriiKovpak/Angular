export interface ICreateUserByUsername {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  selectedDepartmentIds: number[];
  isSafetySensitive: boolean;
}
