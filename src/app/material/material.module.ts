import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
];
@NgModule({
  declarations: [],
  imports: [CommonModule, material],
  exports: [material],
})
export class MaterialModule {}
