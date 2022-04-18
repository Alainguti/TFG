import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthenticationService} from "../../services/authentication.service";
import {FirebaseService} from "../../services/firebase.service";
import {Usuari} from "../../model/usuari";
import {Observable} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup
  user: Usuari
  code?: string

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authService: AuthenticationService,
    private fbService: FirebaseService

  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      second_name: new FormControl('', [Validators.required]),
      third_name: new FormControl(''),
      code: new FormControl('', [Validators.required])
    });
    this.user = {
      uid: '',
      name: '',
      second_name: '',
      third_name: '',
      rol: 'estudiant',
      sala: -1
    }
  }

  ngOnInit() {
    this.getCode().subscribe((data: any) => {
      this.code = data.data().codi
    })
  }

  createUser() {
    if(this.registerForm.value.code == this.code){
      this.authService.signUpWithEmail(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.name).then(cred => {
        if(cred.user) {
          this.user.name = this.registerForm.value.name
          this.user.second_name = this.registerForm.value.second_name
          this.user.third_name = this.registerForm.value.third_name
          this.user.uid = cred.user.uid
          this.fbService.addUser(this.user).then(() =>
            this.router.navigate(['/login'])
          )
        }
      })
    }
    else{
      console.log("Codi de curs incorrecte")
    }
  }

  getCode(): Observable<any> {
    return this.fbService.getCode()
  }

}
