import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FirebaseService} from "../../../services/firebase.service";
import {Sala} from "../../../model/sala";
import * as _ from 'underscore'
import {Usuari} from "../../../model/usuari";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gestio-sales',
  templateUrl: './gestio-sales.component.html',
  styleUrls: ['./gestio-sales.component.scss']
})
export class GestioSalesComponent implements OnInit {

  users_list: Usuari[] = []
  salas: Sala[] = []
  mentors_list: any[] = []
  mentorForm: FormGroup
  mentors_dict: Map<string, string> = new Map

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) {
    this.mentorForm = new FormGroup({
      nom: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.fireAuth.authState.subscribe(cred => {
      if(cred?.uid) {
        this.fbService.getUser(cred?.uid).subscribe(data => {
          if(data.data().rol != 'admin'){
            this.router.navigate([''])
          }
        })
      }
    })
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
        else if(user.data().rol == "mentor"){
          this.mentors_list.push(user.data())
          this.mentors_dict.set(user.data().uid,user.data().name + ' ' + user.data().second_name + ' ' + user.data().third_name)
        }
      })
    })
  }

  crearSala(){
    const len = this.salas.length + 1
    const sala: Sala = {id: len, mentor:'', horaris: []}
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

  deleteMentorFromGroup(sala_id: number) {
    this.fbService.deleteMentorFromGroup(sala_id).then(() => {
        console.log('Eliminat correctament.')
        window.location.reload()
      }
    )
      .catch(function(error) {
        console.error("Error a l'eliminar.", error);
      });
  }

  assignaMentor(sala_id: number) {
    for(let entry of this.mentors_dict.entries()) {
      if(entry[1] === this.mentorForm.value.nom){
        this.fbService.setMentor(entry[0], sala_id).then(() => {
            console.log('Assignat correctament.')
            window.location.reload()
          }
        )
          .catch(function(error) {
            console.error("Error al assignar.", error);
          });
      }
    }
  }

}
