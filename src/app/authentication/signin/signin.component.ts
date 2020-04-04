import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {rejects} from 'assert';
import {resolve} from 'url';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signingForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
    this.initSignInForm();
  }

  initSignInForm() {
    this.signingForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email] ],
        password: ['', [Validators.required, Validators.minLength(6)] ]
      });
  }
  onSubmitSignInForm() {
    const email = this.signingForm.get('email').value;
    const password = this.signingForm.get('password').value;
    this.authenticationService.signinInUser(email, password).then(
      (data)=> {
         this.router.navigate(['/admin', 'dashboard']);
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }
}
