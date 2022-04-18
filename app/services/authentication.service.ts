import { Injectable } from '@angular/core';
import firebase from 'firebase/compat'
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<firebase.User | null >

  constructor(private fireAuth: AngularFireAuth) {
    this.user = this.fireAuth.authState;
  }

  // Obtener el estado de autenticación
  get authenticated():boolean {
    return this.user != null; // True o False
  }

  // Obtener el observador del usuario actual
  get currentUser(): Observable<firebase.User | null> {
    return this.user;
  }

  // Registro con email, contraseña y nombre
  signUpWithEmail(email: string, pass: string, name: string): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.createUserWithEmailAndPassword(email,pass);
  }

  // Inicio de sesión con email y contraseña
  signInWithEmail(email: string, pass: string): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.signInWithEmailAndPassword(email,pass)
  }

  // Cerrar sesión
  signOut(): Promise<void> {
    return this.fireAuth.signOut();
  }

}
