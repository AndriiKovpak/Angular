import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignaturePad } from 'angular2-signaturepad';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AddlogoComponent } from '../../core/modal/addlogo/addlogo.component';
import { CustomCertificateComponent } from '../../core/modal/custom-certificate/custom-certificate.component';
import { Objectpass } from '../../core/services/objectPass.service';
import { LanguageService } from '../../core/_helpers/languge-filter.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';

@Component({
  selector: 'app-custom-certificate-creator',
  templateUrl: './custom-certificate-creator.component.html',
  styleUrls: ['./custom-certificate-creator.component.scss'],
})
export class CustomCertificateCreatorComponent
  implements OnInit, AfterViewInit {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  public signaturePadOptions: Object = {
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300,
  };

  languagePreference: string = 'en';
  SwitchCustomTrainingCertificateChecked: boolean = false;
  baseUrl: string = environment.apiBase;
  logoTitle: string = '';
  SignatureOneTitle: string = '';
  SignatureTwoTitle: string = '';
  Note: string = '';

  logos: any;
  certificateData: any;
  selected = 'option2';

  signatureOne: any = '';
  signatureTwo: any = '';
  state: string = '#fff';

  data: any = {
    LogoTitle: '',
    LogoLink: '',
    TopLeftLogo: '',
    MiddleLeftLogo: '',
    BottomLeftLogo: '',
    SignatureOneLink: '',
    SignatureOneTitle: '',
    SignatureTwoLink: '',
    SignatureTwoTitle: '',
    Note: '',
  };

  constructor(
    private dialog: MatDialog,
    public dataService: CrudService,
    public toaster: ToastrService,
    public objPass: Objectpass,
    private langService: LanguageService
  ) { }
  ngAfterViewInit(): void {
    // this.signaturePad is now available
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }
  }

  ngOnInit(): void {
    this.GetCustomCertificate();
    this.getCustomCourses();
  }

  IsDefaultId: number = 0;

  previewcertificateById(val: number) {
    this.dataService
      .getAll(`${this.baseUrl + ApiEndpointType.previewcertificateById}/${val}`)
      .then((x: any) => {
        if (x) {
          const dialogRef = this.dialog.open(CustomCertificateComponent, {
            data: {
              url: x.message,
              title: "CertificatePreview"
            },
            width: '60vw'
          });
          dialogRef.afterClosed().subscribe((x) => { });
        }
      })
      .catch((x: any) => {
        return this.toaster.error('Error trying to preview the certificate');
      });
    return;
  }
  GetCustomCertificate() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.GetCustomCertificateList)
      .then((x: any) => {
        if (x) {
          this.certificateData = [{ id: 0, logoTitle: "MyEX Default" }, ...x];
          this.IsDefaultId = this.certificateData.find(
            (x: any) => x.isDefault == true
          )?.id ?? 0;
        }
      })
      .catch((x) => {
        if (x) this.toaster.error(x.error, 'ERROR');
      });
  }

  getCustomCertificateOnEdit(val: any) {
    this.certificateId = val;
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.GetCustomCertificateById}/${val}`
      )
      .then((x: any) => {
        if (!x) x = {};
        this.logoTitle = x.logoTitle;
        this.logos = {
          LogoTitle: x.logoTitle,
          LogoLink: x.logo,
          BottomLeftLogo: x.bottomLeftLogo,
          MiddleLeftLogo: x.middleLeftLogo,
          TopLeftLogo: x.topLeftLogo
        };

        this.SignatureOneTitle = x.signatureOneTitle;
        this.SignatureTwoTitle = x.signatureTwoTitle;

        this.signatureOne = {
          signatureOneLink: x.signatureOne,
          signatureOneTitle: x.signatureOneTitle
        };

        this.signatureTwo = {
          signatureTwoLink: x.signatureTwo,
          signatureTwoTitle: x.signatureTwoTitle
        };

        this.Note = x.note;
      });
  }
  addlogoModalRefernce!: MatDialogRef<AddlogoComponent>;

  openLogo(val: string) {
    switch (val) {
      case 'Logo':
        {
          this.addlogoModalRefernce = this.dialog.open(AddlogoComponent, {
            data: {
              data: val,
              val: this.logos,
            },
          });
        }

        break;
      case 'SignatureOne':
        this.addlogoModalRefernce = this.dialog.open(AddlogoComponent, {
          data: {
            data: val,
            val: this.signatureOne,
          },
        });
        break;
      case 'SignatureTwo':
        this.addlogoModalRefernce = this.dialog.open(AddlogoComponent, {
          data: {
            data: val,
            val: this.signatureTwo,
          },
        });
        break;
      case 'Note':
        this.addlogoModalRefernce = this.dialog.open(AddlogoComponent, {
          data: {
            data: val,
            val: this.Note,
          },
        });
        break;

      default:
        break;
    }

    this.addlogoModalRefernce.afterClosed().subscribe((x: any) => {

      if (!x) return;

      switch (x.event) {
        case 'logo':
          {
            this.logos = x.data;
            this.logoTitle = this.logos.LogoTitle;
          }
          break;
        case 'SignatureOne':
          {
            this.signatureOne = x.data;
            this.SignatureOneTitle = this.signatureOne.signatureOneTitle;
          }
          break;
        case 'SignatureTwo':
          {
            this.signatureTwo = x.data;
            this.SignatureTwoTitle = this.signatureTwo.signatureTwoTitle;
          }
          break;
        case 'Note':
          {
            this.Note = x.data.note;
          }
          break;

        default:
          break;
      }
    });
  }

  changeComplete(value: any) {
    this.state = value.color.hex;
    this.objPass.setColor(this.state);
  }

  customCourses: any[] = [];
  getCustomCourses() {
    this.dataService
      .getAll(this.baseUrl + ApiEndpointType.CustomCourses)
      .then((x: any) => {
        if (x) {
          this.customCourses = x.map((element: any) => {
            return {
              ...element,
              customCertificateId: element.customCertificateId || 0,
              description: this.langService.simplifyData(element.description, this.languagePreference),
              name: this.langService.simplifyData(element.name, this.languagePreference),
            }
          });
        }
      })
      .catch((x) => { });
  }

  makeDefault(event: any, Id: number) {
    if (Id == 0 && this.IsDefaultId == 0) {
      event.target.checked = true;
      return;
    } else {
      this.dataService
        .getAll(
          `${this.baseUrl + ApiEndpointType.MakeCertificateDefault}/${(Id) ? event.target.checked : !event.target.checked}/${((Id) ? Id : this.IsDefaultId)}`
        )
        .then((x: any) => {
          if (x) {
            this.toaster.success(x.message, 'SUCCESS');
            this.GetCustomCertificate();
          }
        })
        .catch();
    }

  }
  certificateId: number = 0;
  courseId: number = 0;
  getIdOfCertificate(certificateId: any, courseId: number) {
    this.certificateId = certificateId.value;
    this.courseId = courseId;
  }
  AssignCourse() {
    this.dataService
      .getAll(
        `${this.baseUrl + ApiEndpointType.AssignCertificateToCustomCourse}/${this.certificateId
        }/${this.courseId}`
      )
      .then((x: any) => {
        if (x) {
          this.toaster.success(x.message, 'SUCCESS');
        }
      })
      .catch();
  }

  SaveCustomCertificate() {
    if (!this.logos && this.logoTitle == "") {
      this.toaster.error('Please add the logo title to save the data.');
      return;
    }
    if (!this.signatureOne && this.SignatureOneTitle == "") {
      this.toaster.error('Please add the signature 1 to save the data.');
      return;
    }
    if (!this.signatureTwo && this.SignatureTwoTitle == "") {
      this.toaster.error('Please add the signature 2 to save the data.');
      return;
    }

    if (this.logos && this.logos?.logoTitle && !(this.logos?.logoTitle != '')) {
      this.toaster.error('Please add the logo title to save the data.');
      return;
    }

    if (
      this.signatureOne &&
      this.signatureOne?.signatureOneTitle &&
      !(this.signatureOne?.signatureOneTitle != '')
    ) {
      this.toaster.error('Please add the signature 1 title to save the data.');
      return;
    }
    if (
      this.signatureTwo &&
      this.signatureTwo?.signatureTwoTitle &&
      !(this.signatureTwo?.signatureTwoTitle != '')
    ) {
      this.toaster.error('Please add the signature 2 title to save the data.');
      return;
    }

    let data: any = {
      BottomLeftLogo: this.logos.BottomLeftLogo,
      MiddleLeftLogo: this.logos.MiddleLeftLogo,
      TopLeftLogo: this.logos.TopLeftLogo,
      logoLink: this.logos.LogoLink,
      logoTitle: this.logos.LogoTitle,
      signatureOneLink: this.signatureOne.signatureOneLink,
      signatureOneTitle: this.signatureOne.signatureOneTitle,
      signatureTwoLink: this.signatureTwo.signatureTwoLink,
      signatureTwoTitle: this.signatureTwo.signatureTwoTitle,
      CertificateId: this.certificateId,
      Note: this.Note
    };



    this.dataService
      .post(this.baseUrl + ApiEndpointType.AddLogo, data)
      .then((x: any) => {
        if (x)
          this.toaster.success(x.message, 'SUCCESS');

        this.logoTitle = '';
        this.signatureOne = ''
        this.signatureTwo = ''
        this.SignatureOneTitle = '';
        this.SignatureTwoTitle = '';
        this.Note = '';
        this.GetCustomCertificate();
      })
      .catch((x) => { });
  }


  deleteCustomCertificate(id: number) {
    if (confirm('Are you sure to delete this record?')) {
      this.dataService
        .post(this.baseUrl + ApiEndpointType.DeleteCustomCertificate + '/' + id, null)
        .then((x: any) => {
          if (x && x.message) {
            this.toaster.success(x.message, 'SUCCESS');
            this.certificateData = this.certificateData.filter((x: any) => x.id != id);
            this.IsDefaultId = this.certificateData.find(
              (x: any) => x.isDefault == true
            )?.id ?? 0;
          }
        })
        .catch((x) => {
          if (x && x.error) this.toaster.error(x.error, 'ERROR');
        });
    }
  }



  getCertificateCategory(event: any) {
    if (event.value == 'default') {
      this.dataService
        .getAll(
          `${this.baseUrl + ApiEndpointType.AssignOneCertificateToAll}/${this.IsDefaultId || 0}`
        )
        .then((x: any) => {
          if (x) {
            this.toaster.success(x.message, 'SUCCESS');
            this.getCustomCourses()
          }
        });
    }
  }
}
