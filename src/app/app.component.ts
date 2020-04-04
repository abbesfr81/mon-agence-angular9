import { Component } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-9';

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCecBEBPcqZlHs6ckuDGKqGlbueL5Qcw0I',
      authDomain: 'monagenceangular9.firebaseapp.com',
      databaseURL: 'https://monagenceangular9.firebaseio.com',
      projectId: 'monagenceangular9',
      storageBucket: 'monagenceangular9.appspot.com',
      messagingSenderId: '903190986843',
      appId: '1:903190986843:web:55cf294d1eb09c7b06ff7e',
      measurementId: 'G-2MM3D34NZ5'
    };
    firebase.initializeApp(firebaseConfig);
  }
}
