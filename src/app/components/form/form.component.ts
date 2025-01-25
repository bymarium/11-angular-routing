import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  public form = input.required<FormGroup>();
  public title = input<string>();
  public message = input<string>();
  public action = input.required<string>();
  public open = input.required<boolean>();
  public clickClose = output<boolean>();
  public submit = input.required<() => void>();

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
