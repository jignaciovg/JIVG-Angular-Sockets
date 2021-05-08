import { Injectable } from '@angular/core';
import { Router , CanActivate , ActivatedRouteSnapshot, CanActivateChild, CanDeactivate, RouterStateSnapshot, UrlTree, Route, UrlSegment, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../app/services/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authSv: AuthService, private router: Router) { }

/*
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let token = this.authSv.getToken();
      if(token == null || token ==""){
        return false;
      }else{
        return true
      };

  }*/

    canActivate() {
      let token = this.authSv.getToken();
        if (token == null || token =="" || token == undefined) {
            console.log('No estás logueado');
            console.log(token);
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

  }
