import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../../services/authentication.service";
import {FirebaseService} from "../../../services/firebase.service";
import {Usuari} from "../../../model/usuari";

@Component({
  selector: 'app-gestio-estudiants',
  templateUrl: './gestio-estudiants.component.html',
  styleUrls: ['./gestio-estudiants.component.scss']
})
export class GestioEstudiantsComponent implements OnInit {

  estudiants_list: Usuari[] = []

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
    this.fbService.getUsuaris().subscribe((docs: any) => {
      docs.forEach((doc: any) => {
        if(doc.data().rol === 'estudiant') {
          this.estudiants_list.push(doc.data())
        }
      })
    })
  }

}
