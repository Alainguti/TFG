import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {Usuari} from "../../../model/usuari";
import * as _ from "underscore";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {updateCurrentUser} from "@angular/fire/auth";

@Component({
  selector: 'app-gestio-usuaris',
  templateUrl: './gestio-usuaris.component.html',
  styleUrls: ['./gestio-usuaris.component.scss']
})
export class GestioUsuarisComponent implements OnInit {

  usuaris: Usuari[] = []
  registerForm: FormGroup

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      second_name: new FormControl('', [Validators.required]),
      third_name: new FormControl(''),
      rol: new FormControl('estudiant', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if(!user){
        this.router.navigate(['/login'])
      }
    })
    this.fbService.getUsuaris().subscribe((docs: any) => {
      docs.forEach((doc: any) => {
        this.usuaris.push(doc.data())
      })
    })
  }

  createUser(){
    this.authService.signUpWithEmail(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.name).then(cred => {
      if(cred.user){
        const user: Usuari = {
          uid: cred.user.uid,
          name: this.registerForm.value.name,
          second_name: this.registerForm.value.second_name,
          third_name: this.registerForm.value.third_name,
          rol: this.registerForm.value.rol
        }
        this.fbService.addUser(user).then(() => {
          this.authService.signOut()
        })
      }
    })
  }

}
