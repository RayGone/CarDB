import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatCommonModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './home/home.component';
import { MatPaginator } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCarDialogComponent } from './home/add-car-dialog/add-car-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { EditCarDialogComponent } from './home/edit-car-dialog/edit-car-dialog.component';
import { FilterDialogComponent } from './home/filter-dialog/filter-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddCarDialogComponent,
    EditCarDialogComponent,
    FilterDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
