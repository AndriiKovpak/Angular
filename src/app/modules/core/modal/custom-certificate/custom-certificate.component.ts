import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-certificate',
  templateUrl: './custom-certificate.component.html',
  styleUrls: ['./custom-certificate.component.scss'],
})
export class CustomCertificateComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<CustomCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.translate.setDefaultLang(localStorage.getItem('lang') || 'en');
    if (this.data) {
      this.data.url = this.data.url.split(',')[0];
      this.transform();
    }
  }
  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
