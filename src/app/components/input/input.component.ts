import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  public text = input<string>();
  public type = input<string>();
  public controlName = input.required<string>();
  public formGroup = input.required<FormGroup>();

  isInvalid(): boolean {
    const control = this.formGroup().get(this.controlName());
    return !!control?.invalid && control?.touched;
  }

  get errorMessage(): string {
    const control = this.formGroup().get(this.controlName());
    if (control?.errors?.['required']) {
      return 'Este campo es obligatorio.';
    }
    if (control?.errors?.['email']) {
      return 'Por favor, introduce un correo válido.';
    }
    if (control?.errors?.['min']) {
      return `El valor debe ser mayor o igual a ${control?.errors['min'].min}.`;
    }
    return 'El valor introducido no es válido.';
  }
}
