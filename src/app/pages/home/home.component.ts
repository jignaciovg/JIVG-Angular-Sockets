import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tokenjwt:string="";
  tokenDecode:any;
  suscription$: Subscription;
  isRegistro:boolean = false;
  listaUsuarios: any[] = [];

  constructor(public socket: SocketioService, public authSvc: AuthService, private router: Router) {
    this.socket.checkStatus();
    this.suscription$ = this.socket.on('broadcast-message').subscribe((usersList: any) => {
      this.listaUsuarios = usersList;
    });
  }

  ngOnInit(): void {
    this.tokenjwt = this.authSvc.getToken();
    this.socket.checkStatus();
    this.tokenDecode = this.authSvc.getDecodeToken();
    console.log(this.tokenDecode);
    console.log('TOKEN:'+this.authSvc.getToken());
  }

  LogOut(){
    try {
      this.tokenDecode = this.authSvc.getDecodeToken();
      this.authSvc.DeleteSocketId(this.tokenDecode.email).then(
        (user: any) => {
          this.socket.emit('disconnect', {
            email: user.email,
          });
          this.suscription$ = this.socket.on('log-out').subscribe((usersList: any) => {
            this.listaUsuarios = usersList;
          });
        }
      )
        localStorage.removeItem('jwToken');
        localStorage.removeItem('jwToken');
        this.socket.checkStatus();
        this.router.navigate(["/login"]);
    } catch (error) {
      this.socket.checkStatus();
      localStorage.removeItem('jwToken');
      localStorage.removeItem('jwToken');
      this.router.navigate(["/login"]);
    }

    //this.tokenDecode = this.authSvc.getDecodeToken();

     /*   this.socket.emit('disconnect', {
          socketId: this.tokenDecode.socketId,
          email: this.tokenDecode.email
        });
      localStorage.removeItem('jwToken');
      localStorage.removeItem('jwToken');*/
    //this.router.navigate(["/login"]);
  }
  /*ngOnDestroy(): void {
    this.suscription$.unsubscribe();
  }*/
}
