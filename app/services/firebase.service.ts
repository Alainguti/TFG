import { Injectable } from '@angular/core';
import { AngularFirestore} from "@angular/fire/compat/firestore";
import {Usuari} from "../model/usuari";
import {map, Observable, Timestamp} from "rxjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import {Sala} from "../model/sala";
import firebase from "firebase/compat";

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

  getSala(sala_id:number) {
    return this.firebase.collection('Sales').doc(sala_id.toString()).get()
  }

  getHoraris() {
    return this.firebase.collection('Horaris').get()
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

  setHorari(hora: Date) {
    return this.firebase.collection('Horaris').add({hora: hora})
  }

  setHorariMentor(horaris: Date[], uid: string) {
    return this.firebase.collection('Usuaris').doc(uid).update({horaris: horaris})
  }

  setHorariSala(horaris: Date[], id: number) {
    return this.firebase.collection('Sales').doc(id.toString()).update({horaris: horaris})
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

  getHorariId(hora: Date) {
    return this.firebase.collection('Horaris', ref => ref.where('hora', '==', hora)).get()
  }

  deleteHorari(id: string) {
    return this.firebase.collection('Horaris').doc(id).delete()
  }

}
