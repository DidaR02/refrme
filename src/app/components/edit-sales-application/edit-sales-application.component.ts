import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-sales-application',
  templateUrl: './edit-sales-application.component.html',
  styleUrls: ['./edit-sales-application.component.css']
})
export class EditSalesApplicationComponent implements OnInit {

  applicationFormState: string ="editSales";
  saleApplicationId: string;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditSalesApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
    ) {
      this.saleApplicationId = this.modalData.saleAppId;
    }

  ngOnInit(): void {
  }
 
  closeModal() {
    this.dialogRef.close();
  }
}