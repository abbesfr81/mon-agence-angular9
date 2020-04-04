import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {rejects} from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  signinInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(
            () => {
              resolve();
            }
          ).catch(
            (error) => {
               reject(error);
            }
           );
      }
    );
  }

  signOutUser() {
    firebase.auth().signOut();
  }
}
