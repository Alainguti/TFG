import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import * as _ from "underscore";
import {Sala} from "../../../model/sala";
import {Usuari} from "../../../model/usuari";

@Component({
  selector: 'app-sales-mentor',
  templateUrl: './sales-mentor.component.html',
  styleUrls: ['./sales-mentor.component.scss']
})
export class SalesMentorComponent implements OnInit {

  uid: string = ''
  salas: Sala[] = []
  users_list: Usuari[] = []

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.fireAuth.authState.subscribe(cred => {
      if(cred?.uid) {
        this.uid = cred?.uid
        this.fbService.getUser(cred?.uid).subscribe(data => {
          if(data.data().rol != 'mentor'){
            this.router.navigate([''])
          }
        })
        this.fbService.getSales().subscribe((docs:any) => {
          docs.forEach((doc: any) => {
            for(let mentor of doc.data().mentors) {
              if(mentor === this.uid) {
                this.salas.push(doc.data())
                this.salas = _.sortBy(this.salas, 'id')
              }
            }
          })
        })
      }
    })
    this.authService.currentUser.subscribe(user => {
      if(!user){
        this.router.navigate(['/login'])
      }
    })
    this.fbService.getUsuaris().subscribe((users: any) => {
      users.forEach((user: any) => {
        if(user.data().rol == "estudiant"){
          this.users_list.push(user.data())
        }
      })
    })
  }

  getHora(horari:any) {
    return new Date(horari.seconds*1000)
  }

}
