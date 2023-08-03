import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedCoursesComponent } from 'src/app/modules/company-admin/shared-courses/shared-courses.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(
    private router:Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    const dialogRef =  this.dialog.open(SharedCoursesComponent);
   }

checkClass():any{
return  this.router.url

}
}
