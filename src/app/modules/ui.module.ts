import { RegistrationComponent } from './pages/registration/registration.component';
import { BuyComponent } from './pages/buy/buy.component';
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { RouterModule } from "@angular/router";
import { LayoutComponent } from "./core/layouts/layout.component";
import { StaticPageLayoutComponent } from "./core/static-page-layout/static-page-layout.component";
import { DashboardModule } from "./admin-dashboard/dashboard.module";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { LoginComponent } from "./pages/login/login.component";
import { ResetPasswordConfirmationComponent } from './pages/reset-password-confirmation/reset-password-confirmation.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { InviteComponent } from './pages/Invite/invite.component';


const routes: Routes = [
  {
    path: 'resetpassword/:userId',
    component: ResetPasswordComponent
  },
  {
    path: 'resetpasswordconfirmation',
    component: ResetPasswordConfirmationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
  ,
  {
    path: 'login/:id/:id2',
    component: LoginComponent
  },
  {
    path: 'forgotPassowrd',
    component: ForgotPasswordComponent
  },
  {
    path: 'buy',
    component: BuyComponent
  },
  {
    path: 'invite',
    component: InviteComponent
  },
  {
    path: 'invite/:id',
    component: InviteComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'landing', component: StaticPageLayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  { path: '', redirectTo: 'landing/home', pathMatch:'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'user', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
      { path: 'companyadmin', loadChildren: () => import('./company-admin/company-admin.module').then(m => m.CompanyAdminModule) },
      { path: 'admin', loadChildren: () => import('./admin-dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'employee-home', loadChildren: () => import('./employee-dashboard/employee-dashboard.module').then(x => x.EmployeeDashboardModule) },
    ]
  },
  { path: '**', redirectTo: 'landing/home' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [/*route guard */]
})
export class UIModules { }
