import { Component, OnInit } from '@angular/core';
import {Usuari} from "../../../model/usuari";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";

@Component({
  selector: 'app-sala-usuari',
  templateUrl: './sala-usuari.component.html',
  styleUrls: ['./sala-usuari.component.scss']
})
export class SalaUsuariComponent implements OnInit {

  user?: Usuari
  companys: any[] = []
  mentor: Usuari = {
    name: '',
    uid: '',
    second_name:'',
    third_name:'',
    rol:'',
    sala: -1,
    mail: ''
  }

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
    this.fireAuth.authState.subscribe(cred => {
      if(cred?.uid) {
        this.fbService.getUser(cred?.uid).subscribe(data => {
          this.user = data.data()
          this.fbService.getUsuaris().subscribe((users: any) => {
            users.forEach((user: any) => {
              if(user.data().rol == "estudiant"){
                if(user.data().sala == data.data().sala){
                  if(data.data().uid != user.data().uid){
                    this.companys.push(user.data())
                  }
                }
              }
              else if(user.data().rol == "mentor"){
                if(data.data().sala){
                  this.fbService.getSala(data.data().sala).subscribe((info:any) => {
                    if(user.data().uid == info.data().mentor){
                      this.mentor = user.data()
                    }
                  })
                }
              }
            })
          })
        })
      }
    })
  }

}
