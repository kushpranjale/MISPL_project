import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbPaginationModule,
  NgbAlertModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import {
  MatTableModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
} from "@angular/material";

const material = [
  MatTableModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgbDropdownModule,
];
@NgModule({
  declarations: [],
  imports: [CommonModule, material],
  exports: [material],
})
export class MaterialModule {}
