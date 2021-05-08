import { Injectable } from '@angular/core';
import { Router , CanActivate , ActivatedRouteSnapshot, CanActivateChild, CanDeactivate, RouterStateSnapshot, UrlTree, Route, UrlSegment, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../app/services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const token = localStorage.getItem('jwToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  }
