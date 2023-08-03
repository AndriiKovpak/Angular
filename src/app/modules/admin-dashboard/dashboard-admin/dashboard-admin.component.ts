import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { ToastrService } from 'ngx-toastr';
import { Component, DebugElement, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../core/excel/excel.service';
import { CrudService } from '../../core/genric-service/crudservice';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
})
export class DashboardAdminComponent implements OnInit {
  baseUrl: string = environment.apiBase;
  dashboardData: any;
  users: any[] = [];
  constructor(
    private crudService: CrudService,
    public translate: TranslateService,
    public translationService: TranslationService,
    private excelService: ExcelService,
    private toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.translationService.onLanguageChange.subscribe((lang: any) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
    this.getCompaniesStatus();
    this.getUsersList();
  }

  getCompaniesStatus() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetAdminCompaniesStats)
      .then((x: any) => {
        if (x) this.dashboardData = x;
      })
      .catch((x) => { });
  }
  getUsersList() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetUsersList)
      .then((x: any) => {

        if (x) this.users = x;
        // this.excelService.downloadFile(this.users , 'Users');
      })
      .catch((x) => { });
  }
  downloadActiveUsers(val: string) {


    switch (val) {
      case 'active':
        if (this.users.length > 0) {
          let activeUsers = this.users.filter((x) => x.userStatusID == 3);
          if (activeUsers && activeUsers.length > 0)
            this.excelService.downloadFile(activeUsers, 'ActiveUsers');
          else this.toster.info('No users to view');
        }
        break;
      case 'Invited':
        if (this.users.length > 0) {
          let activeUsers = this.users.filter((x) => x.userStatusID == 1);
          if (activeUsers && activeUsers.length > 0)
            this.excelService.downloadFile(activeUsers, 'InvitedUsers');
          else this.toster.info('No users to view');
        }
        break;
      case 'Inactive':
        if (this.users.length > 0) {
          let activeUsers = this.users.filter((x) => x.userStatusID == 4);
          if (activeUsers && activeUsers.length > 0)
            this.excelService.downloadFile(activeUsers, 'InactiveUsers');
          else this.toster.info('No users to view');
        }
        break;
      case 'SafetySensitive':
        if (this.users.length > 0) {
          let activeUsers = this.users.filter((x) => x.isSafetySensitive);
          if (activeUsers && activeUsers.length > 0)
            this.excelService.downloadFile(activeUsers, 'SafetySensitive');
          else this.toster.info('No users to view');
        }
        break;
      case 'eligibleForAMT':
        if (this.users.length > 0) {
          let activeUsers = this.users.filter(
            (x: any) => x.isSafetySensitive && x.userStatusID == 3
          );
          if (activeUsers && activeUsers.length > 0)
            this.excelService.downloadFile(activeUsers, 'EligibleForAMT');
          else this.toster.info('No users to view');
        }
        break;
      default:
        break;
    }
  }

  usersWithType: any[] = [];
  getUsersAccordingToType(val: string) {
    this.crudService
      .getAll(
        `${this.baseUrl + ApiEndpointType.getUsersListAccordingRole}/${val}`
      )
      .then((x: any) => {
        this.usersWithType = x;
        if (this.usersWithType.length > 0)
          switch (val) {
            case 'companyAdmin':
              this.excelService.downloadFile(
                this.usersWithType,
                'CompanyAdmins'
              );
              break;
            case 'total':
              this.excelService.downloadFile(this.usersWithType, 'AllUsers');
              break;
            case 'users':
              this.excelService.downloadFile(this.usersWithType, 'Users');
              break;
            default:
              break;
          }
        else this.toster.info('No users to view.');
      })
      .catch((x) => { });
  }
  downloadUsersWithType(val: string) {

    this.usersWithType = [];
    switch (val) {
      case 'companyAdmin':
        this.getUsersAccordingToType(val);
        break;
      case 'total':
        this.getUsersAccordingToType(val);
        break;
      case 'users':
        this.getUsersAccordingToType(val);
        break;
      default:
        break;
    }
  }
  companies: any[] = [];
  getCompanies(val: string) {
    this.crudService
      .getAll(`${this.baseUrl + ApiEndpointType.GetCompanyUsers}/${val}`)
      .then((x: any) => {
        this.companies = x;

        switch (val) {
          case 'Active':
            this.excelService.downloadFile(this.companies, 'ActiveCompanies');
            break;
          case 'InActive':
            this.excelService.downloadFile(this.companies, 'InActiveCompanies');
            break;
          case 'Demo':
            this.excelService.downloadFile(this.companies, 'DemoCompanies');
            break;
          case 'Training':
            this.excelService.downloadFile(this.companies.map(e => {
              return {
                'Name': `${e.firstName} ${e.lastName}`,
                'Company Name': e.company.name,
                'Total Licenses': e.company.noOfLicense,
                'Custom Courses Creator Status': e.company?.purchasedCustomCourseCreator ? 'Purchased' : 'Not purchased',
                'Spanish Status': e.company?.purchasedSpanishLanguageCourse ? 'Purchased' : 'Not purchased',
                'Address': (e.street || '') + ((e.state && e.street) ? ', ' : "") + (e.state || ''),
                'Phone': (e.phoneNumber || '') + ' ',
                'Email': (e.email || '')
              }
            }), 'Training');
            break;
          case 'Calibration':
            this.excelService.downloadFile(this.companies.map(e => {
              return {
                'Name': `${e.firstName} ${e.lastName}`,
                'Company Name': e.company.name,
                'Calibration Package Purchased': (e.company?.purchasedCalibration || e.company?.purchasedCalibrationEnterprise) ? 'Purchased' : 'Not purchased',
                'Address': (e.street || '') + ((e.state && e.street) ? ', ' : "") + (e.state || ''),
                'Phone': (e.phoneNumber || '') + ' ',
                'Email': (e.email || '')
              }
            }), 'Calibration');
            break;
          default:
            break;
        }
      })
      .catch((x) => { });
  }

  downloadCompaniesAccordingType(val: string) {

    this.companies = [];
    switch (val) {
      case 'Active':
        this.getCompanies(val);
        break;
      case 'InActive':
        this.getCompanies(val);
        break;
      case 'Demo':
        this.getCompanies(val);
        break;
      case 'Training':
        this.getCompanies(val);
        break;
      case 'Calibration':
        this.getCompanies(val);
        break;
      default:
        break;
    }
  }
  test: any[] = [];
  getTests() {
    this.crudService
      .getAll(this.baseUrl + ApiEndpointType.GetTestTaken)
      .then((x: any) => {

        if (x) {
          this.test = x;

          if (this.test.length > 0)
            switch (this.testType) {
              case 'taken':
                this.excelService.downloadFile(this.test, 'TestsTaken');
                break;
              case 'passed':
                this.excelService.downloadFile(
                  this.test.filter((x: any) => x.passed),
                  'TestsPassed'
                );
                break;
              case 'failed':
                this.excelService.downloadFile(
                  this.test.filter((x: any) => !x.passed),
                  'TestsFailed'
                );
                break;
              default:
                break;
            }
          else this.toster.info('No tests to view.');
        }
      })
      .catch((x) => { });
  }
  testType: string = '';
  downloadTestTypes(val: string) {
    this.testType = val;

    switch (val) {
      case 'taken':
        this.getTests();
        break;
      case 'passed':
        this.getTests();
        break;
      case 'failed':
        this.getTests();
        break;
      default:
        break;
    }
  }
}
