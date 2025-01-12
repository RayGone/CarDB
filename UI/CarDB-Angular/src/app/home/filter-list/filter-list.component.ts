import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterModel } from '../../model';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrl: './filter-list.component.scss'
})
export class FilterListComponent {
  @Input() filter: FilterModel[] = [];
  @Output() onAdd = new EventEmitter();
  @Output() onDelete = new EventEmitter<FilterModel>();


  public addFilter(){
    this.onAdd.emit();
  }

  public deleteFilter(f: FilterModel){
    this.onDelete.emit(f);
  }
}
