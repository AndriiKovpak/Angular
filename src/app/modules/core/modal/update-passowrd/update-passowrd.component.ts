import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiEndpointType } from 'src/app/modules/shared/enums/api.routes';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../genric-service/crudservice';
import { MustMatch } from '../../_helpers/must-match.validator';

@Component({
  selector: 'app-update-passowrd',
  templateUrl: './update-passowrd.component.html',
  styleUrls: ['./update-passowrd.component.scss']
})
export class UpdatePassowrdComponent implements OnInit {
  EmpForm!: FormGroup;
  submitted: boolean = false;
  baseUrl: string = environment.apiBase;
  constructor(private formBuilder: FormBuilder, private crudService: CrudService,
    private dialogRef: MatDialogRef<UpdatePassowrdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.data
    this.intializeForm()
  }

  intializeForm() {
    this.EmpForm = this.formBuilder.group
      ({
        password: new FormControl("", [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)]),
        confirmPassword: new FormControl("", [Validators.required])
      },
        {
          validator: MustMatch('password', 'confirmPassword')
        })
  }
  onSubmit() {
    this.submitted = true;
    if (this.EmpForm.invalid) {
      return
    }
    let data:any={
      password: this.EmpForm.value.password,
      passwordConfirm: this.EmpForm.value.passwordConfirm,
      userId: this.data.Id
    }
    this.crudService.post(this.baseUrl + ApiEndpointType.SaveUserDetails, data).then(x => {

    }).catch(x => {
    })
  }
  // convenience getter for easy access to form fields
  get f() { return this.EmpForm.controls; }

  onCancel() {
      this.dialogRef.close()
  }

}
