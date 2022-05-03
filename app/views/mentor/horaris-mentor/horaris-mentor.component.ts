import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from "underscore";

@Component({
  selector: 'app-horaris-mentor',
  templateUrl: './horaris-mentor.component.html',
  styleUrls: ['./horaris-mentor.component.scss']
})
export class HorarisMentorComponent implements OnInit {

  horaris_admin: Date[] = []
  horaris_mentor: Date[] = []
  uid: string = ''

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
        this.fbService.getUser(cred?.uid).subscribe((data:any) => {
          for(let hora of data.data().horaris) {
            let h = new Date(hora.seconds*1000)
            this.horaris_mentor.push(h)
            this.horaris_mentor = _.sortBy(this.horaris_mentor)
          }
        })
      }
    })
    this.authService.currentUser.subscribe(user => {
      if(!user){
        this.router.navigate(['/login'])
      }
    })
    this.fbService.getHoraris().subscribe((horaris: any) => {
      horaris.forEach((horari: any) => {
        let hora = new Date(horari.data().hora.seconds*1000)
        this.horaris_admin.push(hora)
        this.horaris_admin = _.sortBy(this.horaris_admin)
      })
    })
  }

  escollirHorari(horari: Date) {
    if(this.horaris_mentor){
      this.horaris_mentor?.push(horari)
      this.fbService.setHorariMentor(this.horaris_mentor, this.uid).then(() => {
          console.log('Horari escollit correctament.')
        }
      )
        .catch(function(error) {
          console.error("Error al escollit l'horari.", error);
        });
    }
  }

  eliminarHorari(horari: Date) {
    this.horaris_mentor.forEach( (item, index) => {
      if(item === horari) this.horaris_mentor.splice(index,1);
      this.horaris_mentor = _.sortBy(this.horaris_mentor)
    });
    this.fbService.setHorariMentor(this.horaris_mentor, this.uid).then(() => {
        console.log('Horari eliminat correctament.')
      }
    )
      .catch(function(error) {
        console.error("Error al eliminar l'horari.", error);
      });
  }

}
