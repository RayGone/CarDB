import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Car, columnDef, DataFilterModel, baseUrl } from '../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { sampleTime } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddCarDialogComponent } from './add-car-dialog/add-car-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditCarDialogComponent } from './edit-car-dialog/edit-car-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Pagination
  readonly pageSizes = [20, 50, 100];
  public total: number = 0;
  public page: number = 0;
  public pageSize: number = 20;

  // Table Defs
  public readonly columnDef = columnDef;
  public readonly headerDef = [...columnDef.map(col => col.key), 'actions'];
  public dataSource = new MatTableDataSource<Car>();

  // Form Controls
  public readonly searchControl = new FormControl();

  public data: Car[] = [];
  public filterModel: DataFilterModel = {
    filter: [],
    limit: 20,
    order: "asc",
    orderBy: "id",
    search: '',
    page: 0
  };

  public readonly filterUrl = baseUrl + "/filterSearch";

  @ViewChild(MatSort)
  public set matSort(sort: MatSort) {
      this.dataSource.sort = sort;
  }

  constructor(private http: HttpClient,
    public dialogRef: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.fetchDataCount();
  }

  ngOnInit(): void {
      this.searchControl.valueChanges.pipe(sampleTime(200)).subscribe((value: string) => {
        //Local Search
        if(value == "") this.dataSource.data = this.data;
        let search_string = value.toLowerCase();
        this.filterModel.search = search_string;
        let filtered = this.data.filter((row) => row.name.toLowerCase().includes(search_string) || row.origin.toLowerCase().includes(search_string));
        this.dataSource.data = filtered
      });

      if(this.filterModel.search != "") this.searchControl.setValue(this.filterModel.search);
      this.fetch();
  }

  public onPageChange(event: any): void {
      this.page = event.pageIndex;
      this.filterModel.page = event.pageIndex;
      this.filterModel.limit = event.pageSize;

      this.fetch();
  }

  fetchDataCount():void{
    this.http.get(baseUrl + "/total").subscribe((data: any) => {
      this.total = data.total;
    });
  }

  fetch(): void {
    this.http.post<Car[]>(this.filterUrl, this.filterModel).subscribe(data => {
        this.data = data;
        this.dataSource.data = data;

        if(this.filterModel.search != ""){
          let search_string = this.filterModel.search;
          let filtered = this.data.filter((row) => row.name.toLowerCase().includes(search_string) || row.origin.toLowerCase().includes(search_string));
          this.dataSource.data = filtered
        }
    });
  }


  public openAddCarDialog(): void {
    this.dialogRef.open(AddCarDialogComponent,{
      width: '500px',
      height: '450px'
    });

    AddCarDialogComponent.afterSubmit.subscribe((success) => {
      if(success){ this.fetchDataCount(); this.fetch(); }
    });
  }

  public editCar(car: Car): void {
    this.dialogRef.open(EditCarDialogComponent,{
      width: '500px',
      height: '450px',
      data: car
    });

    EditCarDialogComponent.afterSubmit.subscribe((success) => {
    if(success){ this.fetchDataCount(); this.fetch(); }
  });

  }

  public deleteCar(car: Car): void {
    let name = car.name.toUpperCase()
    this.snackBar.open("Deleting Car "+ name + ".", "Close", {duration: 2000});
    this.http.delete(baseUrl + "/delete/" + car.id).subscribe((data: any) => {
      this.snackBar.open(name + " Car Deleted!!", "Close", {duration: 2000});
      this.fetchDataCount();
      this.fetch();
    });
  }
}
