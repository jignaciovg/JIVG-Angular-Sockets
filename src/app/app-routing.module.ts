import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthGuardService as AuthGuard } from './auth.guard';


const routes: Routes = [
  /*PAGES*/
  {path:'home',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
