import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Car, columnDef, DataFilterModel, baseUrl, FilterModel, CarResponse } from '../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable, Sort, SortDirection } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { sampleTime, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddCarDialogComponent } from './add-car-dialog/add-car-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditCarDialogComponent } from './edit-car-dialog/edit-car-dialog.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { carEndPoints } from '../endpoints';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  readonly downloadUrl = carEndPoints.download;
  // Pagination
  readonly pageSizes = [10, 20, 50, 100];
  public total: number = 0;
  public page: number = 0;
  public pageSize: number = 20;

  public defaultSort: Sort = {active: 'id', direction: 'asc'};

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

  public origin: string[] = ["USA", "JAPAN", "EUROPE"];

  @ViewChild(MatSort)
  public set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private http: HttpClient,
    public dialogRef: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.dataSource.data = this.data;
    // this.fetchDataCount();
  }

  sortEventHandler(event: Sort): void {
    // No Changes
    if(event.direction === this.filterModel.order && event.active === this.filterModel.orderBy) return;

    // If Sort is cleared - Reset to default
    if(event.direction  === "") {
      this.filterModel.order = "asc";
      this.filterModel.orderBy = "id";
    }
    else{
      this.filterModel.order = event.direction;
      this.filterModel.orderBy = event.active;
    }
    this.trackFilters(this.filterModel);
    this.fetch();
  }

  ngOnInit(): void {
      this.filterModel = this.getSavedFilters();
      this.page = this.filterModel.page;
      this.pageSize = this.filterModel.limit;

      this.searchControl.valueChanges.pipe(sampleTime(200)).subscribe((value: string) => {
        //Local Search
        if(value == "") this.dataSource.data = this.data;
        let search_string = value.toLowerCase();
        this.filterModel.search = search_string;
        let filtered = this.data.filter((row) => row.name.toLowerCase().includes(search_string) || row.origin.toLowerCase().includes(search_string));
        this.dataSource.data = filtered

        this.trackFilters(this.filterModel);
        if(env.backend != 'firestore') // if backend is firestore do no use server side pattern match search
          this.fetch();
      });

      if(this.filterModel.search != "") this.searchControl.setValue(this.filterModel.search);
      this.fetch();
  }

  ngAfterViewInit(): void {
      const savedSort = this.getSavedSort();
      // console.log({savedSort});
      setTimeout((source: MatTableDataSource<Car>) => {
        if(source && source.sort)
          source.sort.sort(savedSort);
      }, 1000, this.dataSource);
  }

  public addFilter(): void {
    this.dialogRef.open(FilterDialogComponent, {
      width: '500px',
      height: '400px'
    });

    FilterDialogComponent.onFilterAdd.pipe(take(1)).subscribe((filter: FilterModel) => {
      this.filterModel.filter.push(filter);
      if(env.backend == 'firestore')
        this.filterModel.filter = [filter];
      this.page = 0;
      this.filterModel.page = 0;
      this.trackFilters(this.filterModel);
      this.fetch();
    });
  }

  public deleteFilter(filter: FilterModel): void{
    this.filterModel.filter = this.filterModel.filter.filter((f) => f != filter);
    this.trackFilters(this.filterModel);
    this.fetch();
  }

  public onPageChange(event: any): void {
      this.page = event.pageIndex;
      this.filterModel.page = event.pageIndex;
      this.filterModel.limit = event.pageSize;

      this.trackFilters(this.filterModel);
      this.fetch();
  }

  //==============================
  // persistant filters===========
  //==============================
  public trackFilters(filter: DataFilterModel): void{
    localStorage.setItem("filter", JSON.stringify(filter));
  }

  public getSavedFilters(): DataFilterModel{
    const filter = localStorage.getItem("filter");
    if(filter){
      return JSON.parse(filter);
    }

    return this.filterModel
  }

  public getSavedSort(): MatSortable{
    const filterModel = this.getSavedFilters();
    return {id: filterModel.orderBy, start: filterModel.order as SortDirection, disableClear:false};
  }

  isSortDefault(): boolean {
    return this.filterModel.order === this.defaultSort.direction && this.filterModel.orderBy === this.defaultSort.active;
  }


  //==============================
  // Data Fetches================
  //============================

  // fetchDataCount():void{
  //   this.http.get(carEndPoints.total).subscribe((data: any) => {
  //     this.total = data.total;
  //   });
  // }

  fetch(): void {
    if(
        env.backend=='firestore' &&
        this.filterModel.filter.length>0 &&
        !['id', 'name', 'origin'].some((col) => col == this.filterModel.orderBy)
      ){
      this.filterModel.orderBy = "id";
      const flag = parseInt(localStorage.getItem("notification:filter-sort-not-allowed") ?? '0')
      if(flag < 5){
        this.snackBar.open("With filter set, server side sorting is allowed only with [ID, Car Name, Origin].\nPage wise sorting performed.", "Close",
          {duration: 5000, horizontalPosition: 'center', verticalPosition:'top'});

        localStorage.setItem("notification:filter-sort-not-allowed", (flag+1).toString())
      }
    }

    this.http.post<CarResponse>(carEndPoints.get, this.filterModel, {
      headers: {
        accept: "application/json"
      }
    }).subscribe(data => {
      if(data.total < (this.pageSize * (this.page - 1))){
        this.page = 0;
        this.filterModel.page = 0;
        this.fetch();
        return;
      }
      this.data = data.cars;
      this.data.forEach(car => {
        const origin = car.origin.toUpperCase();
        if(!this.origin.some((defOrigin) => defOrigin === origin)){
          this.origin.push(origin);
        }
      });
      this.dataSource.data = data.cars;

      this.total = data.total;
    });

    this.filterModel = this.getSavedFilters();
  }


  public openAddCarDialog(): void {
    this.dialogRef.open(AddCarDialogComponent,{
      width: '500px',
      height: '450px'
    });

    AddCarDialogComponent.afterSubmit.subscribe((success) => {
      if(success){ this.fetch(); }
    });
  }

  public editCar(car: Car): void {
    this.dialogRef.open(EditCarDialogComponent,{
      width: '500px',
      height: '450px',
      data: car
    });

    EditCarDialogComponent.afterSubmit.subscribe((success) => {
    if(success){ this.fetch(); }
  });

  }

  public deleteCar(car: Car): void {
    let name = car.name.toUpperCase()
    this.snackBar.open("Deleting Car "+ name + ".", "Close", {duration: 2000});
    this.http.delete(carEndPoints.delete + "/" + car.id).subscribe((data: any) => {
      this.snackBar.open(name + " Car Deleted!!", "Close", {duration: 2000});
      this.fetch();
    });
  }
}
