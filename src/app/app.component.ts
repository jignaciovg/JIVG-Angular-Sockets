import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-app';
  suscription$: Subscription;
  isRegistro:boolean = false;
  listaUsuarios: any[] = [];

  constructor(public socket: SocketioService, private authSvc: AuthService) {
      this.suscription$ = this.socket.on('broadcast-message').subscribe((usersList: any) => {
        this.listaUsuarios = usersList;
      });
      this.socket.checkStatus();
  }

  ngOnInit() {
    this.ShowRegistro(false);
  }

  ShowRegistro(accion:boolean){
    this.isRegistro = accion;
  }

  loginOAuth2(provider: string) {
    console.log('Provider: ', provider);
    this.authSvc.loginOAuth2(provider)
      .then((user: any) => {
        this.socket.emit('signUp', {
          fullName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL
        });
      })
      .catch((error) => {
        return {
          success: false,
          error
        }
      })
  }

  sendMessage(msg: string) {
    console.log(msg);
    this.socket.emit('message', {
      client: 'Angular', msg
    });
  }

  ngOnDestroy(): void {
    this.suscription$.unsubscribe();
  }

}
