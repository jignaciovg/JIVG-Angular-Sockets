import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  suscription$: Subscription;
  isRegistro:boolean = false;
  listaUsuarios: any[] = [];

  constructor(public socket: SocketioService, private authSvc: AuthService, private router: Router) {
      this.suscription$ = this.socket.on('broadcast-message').subscribe((usersList: any) => {
        this.listaUsuarios = usersList;
      });
      this.socket.checkStatus();
  }

  ngOnInit() {
    this.ShowRegistro(false);
    localStorage.removeItem('jwToken');
    console.log('TOKEN:'+this.authSvc.getToken());
  }

  ShowRegistro(accion:boolean){
    this.isRegistro = accion;
  }

  loginEmail(){
    this.authSvc.UserLogin("pelusa@gmail.com","123afas",environment.API_KEY).then((user: any) => {
      this.socket.emit('signUp', {
        fullName: user.displayName,
        email: "pelusa@gmail.com",
        apiKey:environment.API_KEY,
        photoUrl:"https://es.seaicons.com/wp-content/uploads/2016/11/Windows-Messenger-icon.png"
      });
      this.router.navigate(["/home"]);
    })
    .catch((error) => {
      return {
        success: false,
        error
      }
    })
  }


  loginOAuth2(provider: string) {
    console.log('Provider: ', provider);
    this.authSvc.loginOAuth2(provider)
      .then((user: any) => {
        this.socket.emit('signUp', {
          fullName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          apiKey:environment.API_KEY
        });
        this.authSvc.UserLoginProvider(user.email,environment.API_KEY);
        this.router.navigate(["/home"]);
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
