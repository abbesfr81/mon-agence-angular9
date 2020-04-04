import {Component, OnDestroy, OnInit} from '@angular/core';
import {PropertiesService} from '../services/properties.service';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private propertiesService: PropertiesService) {
  }

  // si on utilise les subject , il faut modifier cette partie par les subscription
  /* ngOnInit(): void {
    this.propertiesService.getPropertiesObservable().subscribe(
      (data: any) => {
        this.properties = data;
      },
      (error) => {
          console.log(error);
        },
      () => {
        console.log('Observable completed');
      }
    );
  }
*/
  sold = true;
  properties = [] ;
  propertiesSubscription: Subscription;

  ngOnInit(): void {
    this.propertiesSubscription =  this.propertiesService.propertiesSubject.subscribe(
      (data: any) => {
        this.properties = data;
      }
    );
    this.propertiesService.emitProperties();
  }

  getSoldValue(index) {
    if(this.properties[index].sold) {
      return 'red';
    } else {
      return 'green';
    }
  }

  ngOnDestroy(): void {
    this.propertiesSubscription.unsubscribe();
  }
}
