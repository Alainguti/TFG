import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {Usuari} from "../../../model/usuari";
import {Sala} from "../../../model/sala";
import {FormGroup} from "@angular/forms";
import * as _ from "underscore";

@Component({
  selector: 'app-vista-global',
  templateUrl: './vista-global.component.html',
  styleUrls: ['./vista-global.component.scss']
})
export class VistaGlobalComponent implements OnInit {

  users_list: Usuari[] = []
  salas: Sala[] = []
  mentors_list: any[] = []
  mentors_dict: Map<string, string> = new Map

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) { }

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

  getHora(horari:any) {
    return new Date(horari.seconds*1000)
  }

}
