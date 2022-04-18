import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FirebaseService} from "../../../services/firebase.service";
import {Observable} from "rxjs";
import {Sala} from "../../../model/sala";
import * as _ from 'underscore'

@Component({
  selector: 'app-gestio-sales',
  templateUrl: './gestio-sales.component.html',
  styleUrls: ['./gestio-sales.component.scss']
})
export class GestioSalesComponent implements OnInit {

  salas: Sala[] = []

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if(!user){
        this.router.navigate(['/login'])
      }
    })
    this.fbService.getSales().subscribe((docs: any) => {
      docs.forEach((doc: any) => {
        this.salas.push(doc.data())
        this.salas = _.sortBy(this.salas, 'id')
      })
    })
  }

  crearSala(){
    console.log(this.salas.length)
    const len = this.salas.length + 1
    const sala: Sala = {id: len, mentor:''}
    this.fbService.crearSala(sala).then(() => {
      console.log('Sala creada correctament.')
      window.location.reload()
      }
    )
      .catch(function(error) {
        console.error("Error al crear la sala.", error);
      });
  }

}
