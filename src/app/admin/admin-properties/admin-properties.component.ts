import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PropertiesService} from '../../services/properties.service';
import {Subscription} from 'rxjs';
import * as $ from 'jquery';
import {Property} from '../../interfaces/property';

@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit {

  propertiesForm: FormGroup;
  propertiesSubscription: Subscription;
  properties: Property[] = [];
  indexToremove;
  indexToUpdate;

  editMode = false;

  photoUploading = false;
  photoUploaded = false;
  photoUrl: string;

  constructor(private formBuilder: FormBuilder, private propertiesService: PropertiesService) {

  }

  ngOnInit(): void {
    this.initPropertiedForm();
    this.propertiesService.propertiesSubject.subscribe(
      (data: Property[]) => {
        this.properties = data;
      }
    );
    this.propertiesService.getProperties();
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

    const newProperty: Property = this.propertiesForm.value;
    newProperty.photo = this.photoUrl ? this.photoUrl : '';
    if (this.editMode) {
      newProperty.sold = this.propertiesForm.get('sold').value ?  this.propertiesForm.get('sold').value : false;
      this.propertiesService.updateProperty(newProperty, this.indexToUpdate);
    } else {
      this.propertiesService.createProperty(newProperty);
    }
    $('#propertiesFormModal').modal('hide');

  }

  resetForm() {
    this.propertiesForm.reset();
    this.editMode = false;
    this.photoUrl = '';
  }

  onDeleteProperties(index) {
   $('#deletePropertyModal').modal('show');
   this.indexToremove = index;

  }

  onConfirmDeleteProperty() {
    if (this.properties[this.indexToremove].photo && this.properties[this.indexToremove].photo !== '') {
      this.propertiesService.removeFile(this.properties[this.indexToremove].photo);
    }

    this.propertiesService.deleteProperty(this.indexToremove);
    $('#deletePropertyModal').modal('hide');
  }

  onEditProperty(property: Property) {

    $('#propertiesFormModal').modal('show');

    this.propertiesForm.get('title').setValue(property.title);
    this.propertiesForm.get('category').setValue(property.category);
    this.propertiesForm.get('surface').setValue(property.surface);
    this.propertiesForm.get('rooms').setValue(property.rooms);
    this.propertiesForm.get('description').setValue(property.description);
    this.propertiesForm.get('sold').setValue(property.sold);
    this.propertiesForm.get('price').setValue(property.price);
    this.photoUrl = property.photo ? property.photo : '';
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

  onUploadFile(event) {
    this.photoUploading = true;

    this.propertiesService.updateFile(event.target.files[0]).then(
      (url: string) => {
        if (this.photoUrl && this.photoUrl !== '') {
          this.propertiesService.removeFile(this.photoUrl);
        }
          this.photoUrl = url;
          this.photoUploading = false;
          this.photoUploaded = true;
          setTimeout( () => {
            this.photoUploaded = true;
          }, 5000);
      }
    );
  }
}
