import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-sales-application',
  templateUrl: './edit-sales-application.component.html',
  styleUrls: ['./edit-sales-application.component.css']
})
export class EditSalesApplicationComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditSalesApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
    ) {
      //console.log(this.modalData);
    }

  ngOnInit(): void {
  }
 
  closeModal() {
    this.dialogRef.close();
  }
}