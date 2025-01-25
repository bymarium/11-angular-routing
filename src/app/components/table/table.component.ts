import { Component, input, output } from '@angular/core';
import { IColumn } from './column.interface';

@Component({
  selector: 'app-table',
  imports: [],
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

  sendDelete(number: number) {
    this.idDelete.emit(number);
  }

  sendUpdate(number: number) {
    this.idUpdate.emit(number);
  }

  public openForm() {
    this.openModal.emit(true);
  }
}
