import {Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../services/authentication.service";
import {Usuari} from "../../model/usuari";
import {FirebaseService} from "../../services/firebase.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Timestamp} from "rxjs";
import * as _ from "underscore";
import firebase from "firebase/compat";
import TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user?: Usuari
  code?: string
  codeForm: FormGroup
  horaris: Date[] = []
  dia: Date

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) {
    this.getCode().subscribe((data: any) => {
      this.code = data.data().codi
    })
    this.codeForm = new FormGroup({
      code: new FormControl('',[Validators.required])
    })
    this.dia = new Date()
  }

  ngOnInit(){
    this.authService.currentUser.subscribe(user => {
      if(!user){
        this.router.navigate(['/login'])
      }
    })
    this.fireAuth.authState.subscribe(cred => {
      if(cred?.uid) {
        this.fbService.getUser(cred?.uid).subscribe(data => {
          this.user = data.data()
        })
      }
    })
    this.getHoraris()
  }

  getCode(): Observable<any> {
    return this.fbService.getCode()
  }

  changeCode() {
    this.fbService.setCode(this.codeForm.value.code).then(() => {
      window.location.reload()
    })
  }

  toUTC(horari: any){
    console.log(horari.seconds)
    let hora = new Date(horari*1000)
    return hora
  }

  getHoraris() {
    this.fbService.getHoraris().subscribe((horaris: any) => {
      horaris.forEach((horari: any) => {
        let hora = new Date(horari.data().hora.seconds*1000)
        this.horaris.push(hora)
      })
    })
  }

  setHorari() {
    console.log("hola")
    this.fbService.setHorari(this.horaris[0]).then(() => {
        console.log('Sala creada correctament.')
      }
    )
      .catch(function(error) {
        console.error("Error al crear la sala.", error);
      });
  }

}
