import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CastFormGroupPipe } from '../../cast-form-group.pipe';
import { IControls, IOptions } from '../../interfaces/controls.interface';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, InputComponent, SelectComponent, CastFormGroupPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private formBuilder = inject(FormBuilder);
  public form = input.required<FormGroup>();
  public title = input<string>();
  public message = input<string>();
  public action = input.required<string>();
  public controls = input.required<IControls[]>();
  public dishesOptions = input<IOptions[]>();
  public submit = output<() => void>();

  get dishes(): FormArray {
    return this.form().get('orderDetails') as FormArray;
  }

  addDish(): void {
    this.dishes.push(this.formBuilder.group({
      dishId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeDish(index: number): void {
    this.dishes.removeAt(index);
  }
}
