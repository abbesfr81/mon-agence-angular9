import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PropertiesService} from '../../services/properties.service';
import {Subscription} from 'rxjs';
import * as $ from 'jquery';
@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit {

  propertiesForm: FormGroup;
  propertiesSubscription: Subscription;
  properties: any[] = [];
  indexToremove;
  indexToUpdate;

  editMode = false;
  constructor(private formBuilder: FormBuilder, private propertiesService: PropertiesService) {

  }

  ngOnInit(): void {
    this.initPropertiedForm();
    this.propertiesService.propertiesSubject.subscribe(
      (data) => {
        this.properties = data;
      }
    );
    this.propertiesService.emitProperties();
  }

  initPropertiedForm() {
    this.propertiesForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        category: ['', Validators.required],
        surface: ['', Validators.required],
        rooms: ['', Validators.required],
        description: '',
        price: '',
        sold: ''
      });
  }
  onSubmitPropertiesForm() {

    const newProperty = this.propertiesForm.value;
    if (this.editMode) {
      this.propertiesService.updateProperty(newProperty, this.indexToUpdate);
    } else {
      this.propertiesService.createProperty(newProperty);
    }
    $('#propertiesFormModal').modal('hide');

  }

  resetForm() {
    this.propertiesForm.reset();
    this.editMode = false;
  }

  onDeleteProperties(index) {
   $('#deletePropertyModal').modal('show');
   this.indexToremove = index;

  }

  onConfirmDeleteProperty() {
    this.propertiesService.deleteProperty(this.indexToremove);
    $('#deletePropertyModal').modal('hide');
  }

  onEditProperty(property) {

    $('#propertiesFormModal').modal('show');

    this.propertiesForm.get('title').setValue(property.title);
    this.propertiesForm.get('category').setValue(property.category);
    this.propertiesForm.get('surface').setValue(property.surface);
    this.propertiesForm.get('rooms').setValue(property.rooms);
    this.propertiesForm.get('description').setValue(property.description);
    this.propertiesForm.get('sold').setValue(property.sold);
    this.propertiesForm.get('price').setValue(property.price);

    const index = this.properties.findIndex(
      (propertyEl) => {
        if (propertyEl === property) {
          return true;
        }
      }
    );
    this.indexToUpdate = index;
    this.editMode = true;
  }
}
