import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Car, columnDef } from '../../model';
import { carEndPoints } from '../../endpoints';

@Component({
  selector: 'app-edit-car-dialog',
  templateUrl: './edit-car-dialog.component.html',
  styleUrl: './edit-car-dialog.component.scss'
})
export class EditCarDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditCarDialogComponent>,
    public snackBar: MatSnackBar,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: Car) {
      this.editForm.patchValue(data);
    }

  public property = columnDef;

  public editForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    origin: new FormControl("", Validators.required),
    model_year: new FormControl(null, Validators.required),
    acceleration: new FormControl(),
    horsepower: new FormControl(),
    mpg: new FormControl(),
    weight: new FormControl(),
    cylinders: new FormControl(),
    displacement: new FormControl()
  });


  public static afterSubmit: Subject<boolean> = new Subject<boolean>();

  submit(): void {
    this.editForm.markAllAsTouched();
    if(!this.editForm.valid){
      this.snackBar.open("Please fill out all required fields", "Close");
      return;
    }
    this.snackBar.open("Updating Car...", "Close", {duration: 2000});

    const body: Car = {
      ...this.editForm.getRawValue(),
      id: this.data.id
    };


    let name = this.data.name.toUpperCase();
    this.snackBar.open("Updating Car "+ name + ".", "Close", {duration: 2000});

    const url = carEndPoints.edit.replace("{id}", this.data.id.toString());
    this.http.patch(url, body).subscribe((data: any) => {
      this.snackBar.open(name + " Car Updated Successfully!!", "Close", {duration: 2000});
      this.dialogRef.close();

      EditCarDialogComponent.afterSubmit.next(true);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
