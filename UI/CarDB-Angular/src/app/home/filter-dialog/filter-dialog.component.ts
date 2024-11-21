import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filterAttributes, FilterModel, filterOps } from '../../model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})

export class FilterDialogComponent {
  public filterDef = filterAttributes;
  public opDef = filterOps;

  attrSelected: boolean = false;
  opSelected: boolean = false;

  public static onFilterAdd: Subject<FilterModel> = new Subject<FilterModel>();

  public filterForm: FormGroup = new FormGroup({
    field: new FormControl(),
    ops: new FormControl(),
    value: new FormControl(0, Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    public snackBar: MatSnackBar) {
      console.log("filterDef", this.filterDef);
      this.filterForm.valueChanges.subscribe((value) => {
        this.attrSelected = !!value.field;
        this.opSelected = !!value.ops;
      });
    }

  public close(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.close();
    FilterDialogComponent.onFilterAdd.next(this.filterForm.value);
  }
}
