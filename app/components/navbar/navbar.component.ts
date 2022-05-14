import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  titol?:string

  constructor(
    private authService: AuthenticationService,
    private fbService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.fbService.getCredentials().subscribe((data:any) => {
      this.titol = data.data().titol
    })
  }

  signOut(): void {
    this.authService.signOut()
  }

}
