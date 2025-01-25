import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { IControls } from '../../interfaces/controls.interface';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, InputComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  public form = input.required<FormGroup>();
  public title = input<string>();
  public message = input<string>();
  public action = input.required<string>();
  public open = input.required<boolean>();
  public controls = input.required<IControls[]>();
  public submit = output<() => void>();
  public clickClose = output<boolean>();

  private modal = document.querySelector('dialog') as HTMLDialogElement;

  public openModal() {
    if (this.open()) {
      this.modal.showModal();
    } 
    else {
      this.modal.close();
    }
  }

  public closeModal() {
    this.clickClose.emit(false);
  }
}
