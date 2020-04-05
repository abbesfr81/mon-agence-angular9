import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = "Ma super agence";

  isLoggedIn = false;
  isDisabled = true;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if (userSession)  {
          console.log('connecte', userSession);
          if (userSession) {
            this.isLoggedIn = true;
          }
        } else {
          console.log('deconnecte',userSession);
          this.isDisabled = false;
        }
      }
    );
  }

  onClick() {
    this.isDisabled = false;
  }
  onSignOut() {
    this.authenticationService.signOutUser();
  }

}

