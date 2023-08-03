import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  changePasswordForm!: FormGroup;
  submitted = false;
  userInfo: any;
  baseUrl: string = environment.apiBase;
  imgUrl: string | ArrayBuffer | null = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dataService: CrudService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.userInfo = userInfo;
        this.intializeForms();
      }
    })
  }

  intializeForms() {
    this.form = this.formBuilder.group({
      title: [this.userInfo?.title, Validators.required],
      firstName: [
        this.userInfo?.displayUserName?.split(' ')[0] ?? '',
        Validators.required,
      ],

      lastName: [
        this.userInfo?.displayUserName?.split(' ')[1] ?? '',
        Validators.required,
      ],

      Image: [this.userInfo?.profileImage],
    });

    this.changePasswordForm = this.formBuilder.group({
        currentPassword: new FormControl('', [
          Validators.required,

        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ]),
        passwordConfirm: new FormControl('', [Validators.required]),
      }
    )
  }

  submitPasswordChange(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.dataService
      .post(
        environment.apiBase +  ApiEndpointType.ChangePassword,
        this.changePasswordForm.value
      )
      .then((x: any) => {
        this.toastr.success(x.message, 'SUCCESS');;
        this.changePasswordForm.reset();
      })
      .catch((x) => {
        this.toastr.error(x.error, 'ERROR');
      });

    // this.userService.changePassword$({
    //   newPassword: this.changePasswordForm.value.newPassword,
    //   oldPassword: this.changePasswordForm.value.oldPassword,
    // }).subscribe(() => {
    //   this.toastr.success('Password updated');
    //   this.changePasswordForm.reset();
    // }, (err) => {
    //   this.toastr.error('Could not update password');
    // });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let data: any = {
      firstName: this.form.value.firstName,
      id: this.userInfo.userId,
      isUpdateProfile: false,
      lastName: this.form.value.lastName,
      ProfileImage: this.imgUrl || this.userInfo.profileImage,
      title: this.form.value.title,
    };
    this.senddata(data);
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  onImgError(event: any) {
    event.target.src = "/assets/images/icons/User.svg"
  }
  onReadImgUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const formData: FormData = new FormData();
        formData.append(
          'files',
          event.target.files[0],
          event.target.files[0].name
        );
        this.dataService
        .post(this.baseUrl + ApiEndpointType.saveimageurl, formData)
        .then((x: any) => {
          if (x) this.imgUrl = x.url;
        })
        .catch((x) => {});
      }
      reader.readAsDataURL(file);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  senddata(data: any) {
    this.dataService
      .post(this.baseUrl + ApiEndpointType.UpdateUser, data)
      .then((x: any) => {
        if (x && x.message) {
          if(this.imgUrl){
            this.userInfo.profileImage = this.imgUrl;
            this.imgUrl = "";
          }
          this.toastr.success(x.message, 'SUCCESS');
        }
      })
      .catch((x) => {});
  }

}
