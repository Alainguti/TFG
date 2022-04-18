import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FirebaseService} from "../../../services/firebase.service";
import {Sala} from "../../../model/sala";
import * as _ from 'underscore'
import {Usuari} from "../../../model/usuari";

@Component({
  selector: 'app-gestio-sales',
  templateUrl: './gestio-sales.component.html',
  styleUrls: ['./gestio-sales.component.scss']
})
export class GestioSalesComponent implements OnInit {

  users_list: Usuari[] = []
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
    this.fbService.getUsuaris().subscribe((users: any) => {
      users.forEach((user: any) => {
        if(user.data().rol == "estudiant"){
          this.users_list.push(user.data())
        }
      })
    })
  }

  crearSala(){
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

  deleteUserFromGroup(uid: string) {
    this.fbService.deleteUserFromGroup(uid).then(() => {
        console.log('Eliminat correctament.')
        window.location.reload()
      }
    )
      .catch(function(error) {
        console.error("Error a l'eliminar.", error);
      });
  }

}
