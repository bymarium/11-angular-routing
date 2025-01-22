import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    address: this.formBuilder.group({
      street: [''],
      number: [''],
      zipCode: ['']
    }),
    tags: this.formBuilder.array([this.formBuilder.control('')])
  })

  get tags(): FormArray {
    return this.loginForm.get('tags') as FormArray;
  }

  submit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }

    console.log(this.loginForm);
    
  }

  addTag(): void {
    this.tags.push(this.formBuilder.control(''))
  }

  // removeTag(index: number): void {
  //   const controls = this.tags.controls.filter((control) => control !== value)
  //   this.tags.clear();
  //   controls.forEach((control) => this.tags.push(control));

  //   console.log(this.tags.controls);
  // }
}
