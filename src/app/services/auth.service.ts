import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';

const URL_BASE:string = environment.API.EndPoint.Node;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:any;
  lista:any ={};

  constructor(public socket: SocketioService,private fireAuth: AngularFireAuth, private http:HttpClient,private router: Router) {
    firebase.initializeApp(environment.FIREBASE_SETTINGS);
    firebase.auth().onAuthStateChanged((user: any) => {
      //console.log('Evento onAuthStateChanged: ', user);
    });
  }

  async loginOAuth2(provider: string) {
    let oauth2 = null;
    switch(provider) {
      case 'Google':
        oauth2 = new firebase.auth.GoogleAuthProvider();
        oauth2.setCustomParameters({prompt: 'select_account'});
        break;
      case 'Microsoft':
        oauth2 = new firebase.auth.OAuthProvider('microsoft.com');
        oauth2.setCustomParameters({prompt: 'select_account'});
        break;
      case 'Apple':
        oauth2 = new firebase.auth.OAuthProvider('apple.com');
        break;
      case 'Yahoo':
        oauth2 = new firebase.auth.OAuthProvider('yahoo.com');
        oauth2.setCustomParameters({prompt: 'login'});
        oauth2.addScope('email');
        oauth2.addScope('profile');
        break;
      case 'Facebook':
        oauth2 = new firebase.auth.FacebookAuthProvider();
        break;
      case 'Twitter':
        oauth2 = new firebase.auth.TwitterAuthProvider();
        break;
      default:
        oauth2 = new firebase.auth.GoogleAuthProvider();
        oauth2.setCustomParameters({prompt: 'select_account'});
        break;
    }

    return await this.fireAuth.signInWithPopup(oauth2)
      .then(() =>
      firebase.auth().currentUser
      )
      .catch((error: any) => {
        return {
          success: false,
          error
        }
      });
  }

  //CHECK SOCKET-ID
  async DeleteSocketId(email:string){
    let bodyRequest ={
      email:email
    }

    //console.log('body:'+JSON.stringify(bodyRequest));
    return await this.http.post("http://localhost:3003/checkSocket",
    bodyRequest,{headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(res =>{
      //console.log(res);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Sesion finalizada',
        text: email,
        showConfirmButton: false,
        timer: 1500
      })
    },err =>{
    });

  }
  //User Login
  async UserLogin (email:string,password:string,apiKey:string) {
    //console.log('body:'+JSON.stringify(bodyRequest));
try {
  let bodyRequest ={
    email:email,
    apiKey:apiKey,
    password:password
  }
  const result =  await this.http.post("http://localhost:3003/loginOnEmail",
  bodyRequest,{headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }).subscribe(res =>{
    let newToken = (<any>res).token;
    localStorage.setItem("jwToken", newToken);
    console.log(newToken);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Inicio de sesión exitoso, Token:',
      text: newToken,
      showConfirmButton: false,
      timer: 1900
    })
    localStorage.setItem("jwToken", newToken);
    //this.router.navigate(["/home"]);
  },err =>{
  });
  return result;
} catch (error) {
  return error;
}

    }

  //User Login PROVIDER
  async UserLoginProvider (email:string,apiKey:string) {
    let bodyRequest ={
      email:email,
      apiKey:apiKey
    }
    console.log('body:'+JSON.stringify(bodyRequest));

    return await this.http.post("http://localhost:3003/loginOAuth2",
    bodyRequest,{headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(res =>{
      console.log(res);
      const newToken = (<any>res).token;
      localStorage.setItem("jwToken", newToken);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Inicio de sesión exitoso, Token:',
        text: newToken,
        showConfirmButton: false,
        timer: 1900
      })
    },err =>{
    });

    }

   LogOut(){
      localStorage.removeItem('jwToken');
      localStorage.removeItem('jwToken');
      localStorage.removeItem('jwToken');
    }

    getToken(){
      let token = localStorage.getItem('jwToken');
      if(token != "undefined"){
        this.token = token;
      }else{
        this.token = null;
      }
      return this.token;
    }

    getDecodeToken(){
      let JWR = localStorage.getItem('jwToken');
      let decoded = jwt_decode(JSON.stringify(JWR));
      return decoded;
    }
}
