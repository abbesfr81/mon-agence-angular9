import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  propertiesSubject = new Subject<any[]>();
  constructor() {

  }

  properties = [
    {
      title: 'Ma super maison',
      category: 'Maison',
      sold: true
    },
    {
      title: 'Grande appartement',
      category: 'Appartement',
      sold: false
    },
    {
      title: 'Belle villa',
      category: 'Maison',
      sold: true
    }
  ] ;

  emitProperties() {
    this.propertiesSubject.next(this.properties);
  }
  // ON A PAS BESOIN DE CETTE FONCTION , ON A INTRODUIT LA SUBSCRIPTION DE RXJS,
  // emitProperties qui va nous envoyer les donnees
  getPropertiesPromise() {
   return new Promise(
      ((resolve, reject) => {
        if(this.properties && this.properties.length > 0) {
          resolve(this.properties);
        } else {
          const error = new Error('Properties does not exist');
          reject(error);
        }
      })
    );
  }

  createProperty(property) {
    this.properties.push(property);
  }
  deleteProperty(index) {
    console.log( this.properties);
    this.properties.splice( index, 1);
    console.log( this.properties);
    this.emitProperties();
  }

  updateProperty(property, index) {
    this.properties[index] = property;
    this.emitProperties();
  }

/*  getPropertiesObservable() {
    return new Observable(
      observer => {
        if (this.properties && this.properties.length > 0) {
            observer.next(this.properties);
            observer.complete();
        } else {
          const error = new Error('Properties does not exist');
          console.log(error);
        }
      }
    );
  }
*/

}
