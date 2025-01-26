import { Component, input } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IOptions } from '../../interfaces/controls.interface';

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  public text = input<string>();
  public controlName = input.required<string>();
  public formGroup = input.required<FormGroup>();
  public options = input<IOptions[]>();

  isInvalid(): boolean {
    const control = this.formGroup().get(this.controlName());
    return !!control?.invalid && control?.touched;
  }

  get errorMessage(): string {
    const control = this.formGroup().get(this.controlName());
    if (control?.errors?.['required']) {
      return 'Este campo es obligatorio.';
    }
    return 'El valor seleccionado no es válido.';
  }
}
