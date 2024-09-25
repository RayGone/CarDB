import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Car, baseUrl } from '../../model';

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

  public editForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    origin: new FormControl(),
    model_year: new FormControl(),
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
    this.http.patch(baseUrl + "/edit/" + this.data.id, body).subscribe((data: any) => {
      this.snackBar.open(name + " Car Updated Successfully!!", "Close", {duration: 2000});
      this.dialogRef.close();

      EditCarDialogComponent.afterSubmit.next(true);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
