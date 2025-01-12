import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Car, columnDef } from '../../model';
import { Subject } from 'rxjs';
import { carEndPoints } from '../../endpoints';

@Component({
  selector: 'app-add-car-dialog',
  templateUrl: './add-car-dialog.component.html',
  styleUrl: './add-car-dialog.component.scss'
})
export class AddCarDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddCarDialogComponent>,
    public snackBar: MatSnackBar,
    public http: HttpClient) {}

  public property = columnDef;
  public addForm: FormGroup = new FormGroup({
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
    this.addForm.markAllAsTouched();
    if(!this.addForm.valid){
      this.snackBar.open("Please fill out all required fields", "Close");
      return;
    }
    this.snackBar.open("Adding Car...", "Close", {duration: 2000});

    const body: Car = this.addForm.getRawValue();
    this.http.post(carEndPoints.add, body).subscribe((data: any) => {
      this.snackBar.open(body.name.toUpperCase() + " Car Added Successfully!!", "Close", {duration: 2000});
      this.dialogRef.close();

      AddCarDialogComponent.afterSubmit.next(true);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
