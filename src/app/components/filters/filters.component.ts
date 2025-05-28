import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  selected = '';
  @Input() types!: string[];
  @Input() label!: string;

  @Output() typeChange = new EventEmitter<string>();

  onTypeChange() {
    this.typeChange.emit(this.selected);
  }
}