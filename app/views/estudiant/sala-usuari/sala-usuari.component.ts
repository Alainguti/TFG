import { Component, OnInit } from '@angular/core';
import {Usuari} from "../../../model/usuari";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {Sala} from "../../../model/sala";
import * as _ from "underscore";

@Component({
  selector: 'app-sala-usuari',
  templateUrl: './sala-usuari.component.html',
  styleUrls: ['./sala-usuari.component.scss']
})
export class SalaUsuariComponent implements OnInit {

  user?: Usuari
  companys: any[] = []
  mentors: Usuari[] = []
  sala: number = -1
  sala_horaris: Date[] = []
  horaris_mentor: Date[] = []
  sub: any

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
    this.sub = this.fireAuth.authState.subscribe(cred => {
      if(cred?.uid) {
        this.fbService.getUser(cred?.uid).subscribe((data:any) => {
          this.user = data.data()
          this.fbService.getSala(data.data().sala).subscribe((sala:any) => {
            this.sala = sala.id
            for(let hora of sala.data().horaris) {
              let h = new Date(hora.seconds*1000)
              this.sala_horaris.push(h)
              this.sala_horaris = _.sortBy(this.sala_horaris)
            }
          })
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
                    for(let mentor of info.data().mentors) {
                      if(user.data().uid == mentor){
                        this.mentors.push(user.data())
                        for(let hora of user.data().horaris) {
                          let h = new Date(hora.seconds*1000)
                          this.horaris_mentor.push(h)
                          this.horaris_mentor = _.sortBy(this.horaris_mentor)
                        }
                      }
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

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  escollirHorari(horari: Date) {
    if(this.sala_horaris){
      this.sala_horaris.push(horari)
      this.fbService.setHorariSala(this.sala_horaris, this.sala).then(() => {
          console.log('Horari escollit correctament.')
        }
      )
        .catch(function(error) {
          console.error("Error al escollit l'horari.", error);
        });
    }
  }

  eliminarHorari(horari: Date) {
    if(this.sala_horaris) {
      this.sala_horaris.forEach( (item, index) => {
        if(item === horari) this.sala_horaris.splice(index,1);
        this.sala_horaris = _.sortBy(this.sala_horaris)
      });
      this.fbService.setHorariSala(this.sala_horaris, this.sala).then(() => {
          console.log('Horari eliminat correctament.')
        }
      )
        .catch(function(error) {
          console.error("Error al eliminar l'horari.", error);
        });
    }
  }

}
