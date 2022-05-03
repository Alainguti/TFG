import { Component, OnInit } from '@angular/core';
import {Usuari} from "../../../model/usuari";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {Sala} from "../../../model/sala";
import * as _ from "underscore";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-llista-sales',
  templateUrl: './llista-sales.component.html',
  styleUrls: ['./llista-sales.component.scss']
})
export class LlistaSalesComponent implements OnInit {

  user?: Usuari
  users_list: Usuari[] = []
  salas: Sala[] = []
  mentors_list: any[] = []
  mentors_dict: Map<string, string> = new Map

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) {}

  ngOnInit(): void {
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
        else if(user.data().rol == "mentor"){
          this.mentors_list.push(user.data())
          this.mentors_dict.set(user.data().uid,user.data().name + ' ' + user.data().second_name + ' ' + user.data().third_name)
        }
      })
    })
  }

  entrarSala(sala_id: number) {
    if(this.user){
      this.fbService.addUserToGroup(sala_id, this.user.uid).then(() => {
          console.log('Modificat correctament.')
          window.location.reload()
        }
      )
        .catch(function(error) {
          console.error("Error a l'entrar a la sala.", error);
        });
    }
  }

  sortirSala() {
    if(this.user){
      this.fbService.deleteUserFromGroup(this.user.uid).then(() => {
          console.log('Sortit correctament.')
          window.location.reload()
        }
      )
        .catch(function(error) {
          console.error("Error al sortir de la sala.", error);
        });
    }
  }

}
