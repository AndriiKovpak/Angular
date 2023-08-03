import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedCoursesComponent } from '../shared-courses/shared-courses.component';

@Component({
  selector: 'app-custom-course-side-pannel',
  templateUrl: './custom-course-side-pannel.component.html',
  styleUrls: ['./custom-course-side-pannel.component.scss']
})
export class CustomCourseSidePannelComponent implements OnInit {

    //
    constructor(
      private dialog: MatDialog,
      private router: Router
      ) {

      }
  ngOnInit(): void {
  }
  openModal() {
    const dialogRef =  this.dialog.open(SharedCoursesComponent);
   }
   checkClass():any{
    return  this.router.url

    }

}
