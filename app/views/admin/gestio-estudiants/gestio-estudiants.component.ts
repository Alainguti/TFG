import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {Usuari} from "../../../model/usuari";
import * as _ from 'underscore'
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gestio-estudiants',
  templateUrl: './gestio-estudiants.component.html',
  styleUrls: ['./gestio-estudiants.component.scss']
})
export class GestioEstudiantsComponent implements OnInit {

  estudiants_list: Usuari[] = []
  sales_id_list:number[] = []
  salaForm:FormGroup

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) {
    this.salaForm = new FormGroup({
      id: new FormControl([Validators.required])
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
    this.fbService.getUsuaris().subscribe((docs: any) => {
      docs.forEach((doc: any) => {
        if(doc.data().rol === 'estudiant') {
          this.estudiants_list.push(doc.data())
        }
      })
      this.estudiants_list = _.sortBy(this.estudiants_list, 'sala')
    })
    this.fbService.getSales().subscribe((docs: any) => {
      docs.forEach((doc: any) => {
        this.sales_id_list.push(doc.data().id)
      })
      this.sales_id_list = _.sortBy(this.sales_id_list)
    })
  }

  assignaSala(uid:string) {
    let aux = Number(this.salaForm.value.id)
    console.log(aux)
    this.fbService.addUserToGroup(aux, uid).then(() => {
        console.log('Assignat correctament.')
        window.location.reload()
      }
    )
      .catch(function(error) {
        console.error("Error al assignar.", error);
      });
  }

  desassignarSala(uid:string) {
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
