import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./views/login/login.component";
import {HomeComponent} from "./views/home/home.component";
import {RegisterComponent} from "./views/register/register.component";
import {GestioSalesComponent} from "./views/admin/gestio-sales/gestio-sales.component";
import {GestioUsuarisComponent} from "./views/admin/gestio-usuaris/gestio-usuaris.component";
import {LlistaSalesComponent} from "./views/llista-sales/llista-sales.component";
import {SalaUsuariComponent} from "./views/sala-usuari/sala-usuari.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'admin/gestio_sales', component: GestioSalesComponent},
  { path: 'admin/gestio_usuaris', component: GestioUsuarisComponent},
  { path: 'sales', component: LlistaSalesComponent},
  { path: 'la_meva_sala', component: SalaUsuariComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
