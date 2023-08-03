import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../core/genric-service/crudservice';
import { AuthService } from '../../core/guards/auth.service';
import { ApiEndpointType } from '../../shared/enums/api.routes';
import {userInfo} from "os";

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {
  sessionId: string = '';
  baseUrl: string = environment.apiBase;

  constructor(
    private service: CrudService,
    public matDialog: MatDialog,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params && params.id) {
        this.sessionId = params.id;
        this.saveDataOnPaymentSuccess();
      }
    });
  }

  saveDataOnPaymentSuccess() {
    this.service
      .post$(`${this.baseUrl + ApiEndpointType.Checkout}/${this.sessionId}`, null)
      .subscribe(() => {
        this.toaster.success('SUCCESS');

        this.authService.userInfo$.subscribe(userInfo => {
          if (userInfo?.role.split(',').filter((x: any) => x == 'Admin')[0] == 'Admin') {
            this.router.navigate(['/admin/companies']);
          } else {
            this.router.navigate(['/companyadmin/main-page'])
          }
        })
      }, () => {})
  }
}
