import { Injectable } from '@angular/core';
import { AngularFirestore} from "@angular/fire/compat/firestore";
import {Usuari} from "../model/usuari";
import {map, Observable} from "rxjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import {Sala} from "../model/sala";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firebase: AngularFirestore
  ) { }

  addUser(user: Usuari){
    return this.firebase.collection('Usuaris').doc(user.uid).set(user)
  }

  getUser(uid: string): Observable<any>{
    return this.firebase.collection('Usuaris').doc(uid).get()
  }

  getUsuaris() {
    return this.firebase.collection('Usuaris').get()
  }

  getCode() {
    return this.firebase.collection('Credenciales').doc('cred').get()
  }

  getSales() {
    return this.firebase.collection('Sales').get()
  }

  crearSala(sala:Sala) {
    return this.firebase.collection('Sales').doc(sala.id.toString()).set(sala)
  }

  setCode(code: string) {
    return this.firebase.collection('Credenciales').doc('cred').update({codi: code})
  }

  setMentor(uid: string, sala_id: number) {
    return this.firebase.collection('Sales').doc(sala_id.toString()).update({mentor: uid})
  }

  addUserToGroup(sala_id: number, user_uid: string) {
    return this.firebase.collection('Usuaris').doc(user_uid).update({sala: sala_id})
  }

  deleteUserFromGroup(uid: string) {
    return this.firebase.collection('Usuaris').doc(uid).update({sala: -1})
  }

  deleteMentorFromGroup(sala_id: number) {
    return this.firebase.collection('Sales').doc(sala_id.toString()).update({mentor: ''})
  }

}
