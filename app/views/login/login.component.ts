import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if(user){
        this.router.navigate([''])
      }
    })
  }

  signIn() {
    this.authService.signInWithEmail(this.loginForm.value.email, this.loginForm.value.password).then(() => {
      this.router.navigate([''])
    }).catch(function() {
      window.alert("Credencials incorrectes");
    });
  }

}
