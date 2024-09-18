import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Car, columnDef, DataFilterModel } from '../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { sampleTime } from 'rxjs';

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

  // Table Defs
  public readonly columnDef = columnDef;
  public readonly headerDef = columnDef.map(col => col.key);
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

  public readonly baseUrl = "http://localhost:3000/api"
  public readonly filterUrl = this.baseUrl + "/filterSearch";

  search_string = '';

  @ViewChild(MatSort)
  public set matSort(sort: MatSort) {
      this.dataSource.sort = sort;
  }

  constructor(private http: HttpClient) {
    this.http.get(this.baseUrl + "/total").subscribe((data: any) => {
      this.total = data.total;
    });
  }

  ngOnInit(): void {
      this.http.get<Car[]>(this.baseUrl).subscribe(data => {
          this.data = data;
          this.dataSource.data = data;
      });

      this.searchControl.valueChanges.pipe(sampleTime(200)).subscribe(value => {
        // localStorage.setItem('search_string', value);
        // this.search_string = value;

      });
  }

  public onPageChange(event: any): void {
      this.page = event.pageIndex;
      this.filterModel.page = event.pageIndex;
      this.filterModel.limit = event.pageSize;

      this.http.post<Car[]>(this.filterUrl, this.filterModel).subscribe(data => {
          this.data = data;
          this.dataSource.data = data;
      });
  }
}
