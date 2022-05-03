import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./views/login/login.component";
import {HomeComponent} from "./views/home/home.component";
import {RegisterComponent} from "./views/register/register.component";
import {GestioSalesComponent} from "./views/admin/gestio-sales/gestio-sales.component";
import {GestioUsuarisComponent} from "./views/admin/gestio-usuaris/gestio-usuaris.component";
import {LlistaSalesComponent} from "./views/estudiant/llista-sales/llista-sales.component";
import {SalaUsuariComponent} from "./views/estudiant/sala-usuari/sala-usuari.component";
import {GestioHorarisComponent} from "./views/admin/gestio-horaris/gestio-horaris.component";
import {HorarisMentorComponent} from "./views/mentor/horaris-mentor/horaris-mentor.component";
import {SalesMentorComponent} from "./views/mentor/sales-mentor/sales-mentor.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'admin/gestio_sales', component: GestioSalesComponent},
  { path: 'admin/gestio_usuaris', component: GestioUsuarisComponent},
  { path: 'admin/gestio_horaris', component: GestioHorarisComponent},
  { path: 'mentor/gestio_horaris', component: HorarisMentorComponent},
  { path: 'mentor/gestio_sales', component: SalesMentorComponent},
  { path: 'sales', component: LlistaSalesComponent},
  { path: 'la_meva_sala', component: SalaUsuariComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
