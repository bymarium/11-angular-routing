import { Component, input, output } from '@angular/core';
import { IColumn } from './column.interface';
import { ModalComponent } from "../modal/modal.component";
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

@Component({
  selector: 'app-table',
  imports: [ModalComponent, ConfirmActionComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  public title = input<string>();
  public data = input<any[]>();
  public columns = input<IColumn[]>();
  public idDelete = output<number>();
  public idUpdate = output<number>();
  public openModal = output<boolean>();
  public selectedId: number = 0;
  isOpen: boolean = false;

  openConfirmation(id: number) {
    this.selectedId = id; 
    this.isOpen = true;
  }

  confirmDelete() {
    this.idDelete.emit(this.selectedId);
    this.isOpen = false;
  }

  cancelDelete() {
    this.openModal.emit(false); 
    this.isOpen = false;
  }

  sendUpdate(number: number) {
    this.idUpdate.emit(number);
  }

  public openForm() {
    this.openModal.emit(true);
  }
}
