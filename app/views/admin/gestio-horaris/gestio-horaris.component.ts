import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from "underscore";

@Component({
  selector: 'app-gestio-horaris',
  templateUrl: './gestio-horaris.component.html',
  styleUrls: ['./gestio-horaris.component.scss']
})
export class GestioHorarisComponent implements OnInit {

  horaris: Date[] = []
  horariForm: FormGroup

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) {
    this.horariForm = new FormGroup({
      hora: new FormControl('',[Validators.required])
    })
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
    this.fbService.getHoraris().subscribe((horaris: any) => {
      horaris.forEach((horari: any) => {
        let hora = new Date(horari.data().hora.seconds*1000)
        this.horaris.push(hora)
        this.horaris = _.sortBy(this.horaris)
      })
    })
  }

  setHorari() {
    let hora = new Date(this.horariForm.value.hora)
    this.fbService.setHorari(hora).then(() => {
        console.log('Horari afegit correctament.')
        window.location.reload()
      }
    )
      .catch(function(error) {
        console.error("Error al afegir l'horari.", error);
      });
  }

  eliminarHorari(hora: Date) {
    this.fbService.getHorariId(hora).subscribe((horaris: any) => {
      horaris.forEach((horari: any) => {
        this.fbService.deleteHorari(horari.id).then(() => {
            console.log('Horari eliminat correctament.')
            window.location.reload()
          }
        )
          .catch(function(error) {
            console.error("Error al eliminar l'horari.", error);
          });
      })
    })
  }

}
