import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire/compat";
import { environment } from "../environments/environment";
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import { RegisterComponent } from './views/register/register.component';
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {FirebaseService} from "./services/firebase.service";
import {AuthenticationService} from "./services/authentication.service";
import { NavbarComponent } from './components/navbar/navbar.component';
import { GestioSalesComponent } from './views/admin/gestio-sales/gestio-sales.component';
import { GestioUsuarisComponent } from './views/admin/gestio-usuaris/gestio-usuaris.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    GestioSalesComponent,
    GestioUsuarisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [FirebaseService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
