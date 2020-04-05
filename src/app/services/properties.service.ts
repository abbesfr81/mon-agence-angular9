import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Property} from '../interfaces/property';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  propertiesSubject = new Subject<Property[]>();
  constructor() {

  }

  properties: Property[] = [];

  saveProperties() {
    firebase.database().ref('/properties').set(this.properties);
  }
  emitProperties() {
    this.propertiesSubject.next(this.properties);
  }

  getProperties() {
    firebase.database().ref('/properties').on('value', (data) => {
      this.properties = data.val() ? data.val() : [];
      this.emitProperties();
    });
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

  createProperty(property: Property) {
    this.properties.push(property);
    this.saveProperties();
    this.emitProperties();
  }
  deleteProperty(index) {

    this.properties.splice( index, 1);
    this.saveProperties();
    this.emitProperties();
  }

  // 1 ere façon de faire
  updateProperty2(property, index) {
    this.properties[index] = property;
    this.saveProperties();
    this.emitProperties();
  }
  // 2 eme façon de faire
  updateProperty(property, index) {
    // on a pas besoin de executer emitProperties car dans getProperties() on a utilise .on qui detecte automatiquemet les modification
    // et :
    // this.properties = data.val() ? data.val() : [];
    // this.emitProperties();
    // seront execuetes automatiquement.
    firebase.database().ref('/properties/' + index).update(property).catch(
      (error) => {
        console.error(error);
      }
    );
  }

  updateFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueId = Date.now().toString();
        const fileName = uniqueId + file.name;
        const upload = firebase.storage().ref().child('images/properties/' + fileName).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement ....');
          },
          (error) => {
            console.log(error);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(
              (downloadUrl) => {
                  resolve(downloadUrl);
              }
            );
          }
          );

      }
    );
  }

  removeFile(fileLink: string) {
    if(fileLink) {
      const storageRef = firebase.storage().refFromURL(fileLink);
      storageRef.delete().then(
        () => {
          console.log('photo deleted');
        }
      ).catch(
        (error) => {
          console.error(error);
        }
      );
    }
  }

  getSingleProperty(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/properties/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
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
