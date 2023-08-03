import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { AddNewEmployeeComponent } from '../add-new-employee/add-new-employee.component';

@Component({
  selector: 'app-middle-layout',
  templateUrl: './middle-layout.component.html',
  styleUrls: ['./middle-layout.component.scss'],
})
export class MiddleLayoutComponent {

  @Output() onUserAdded: EventEmitter<number> = new EventEmitter();
  @Input() showAddEmployee: boolean = true;

  constructor(
    private dialog: MatDialog,
    public translate: TranslateService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.switchLanguage();
  }

  switchLanguage() {
    this.translationService.onLanguageChange.subscribe((lang) => {
      this.translate.setDefaultLang(lang ?? 'en');
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddNewEmployeeComponent);
    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.onUserAdded.emit();
      }
     })
  }
}
