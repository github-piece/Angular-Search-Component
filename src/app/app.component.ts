import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tableColumn = [
    { label: 'Company', definition: 'CompanyName', type: 'text', filter: 'true'},
    { label: 'Title', definition: 'TitleId', type: 'select', filter: 'true', endpoint: 'api/controller/action'},
    { label: 'Date Created', definition: 'CreatedOn', type: 'date', filter: 'true'},
    { label: 'Some Field', definition: 'SomeField', type: 'text', filter: 'false'},
    { label: 'Another Field', definition: 'AnotherField', type: 'bool', filter: 'true'},
    { label: 'Actions', definition: 'actions', type: 'bool', filter: 'true'}
  ];
  options = [
    {
      type: 'date',
      values: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal'],
      data: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
    },
    {
      type: 'text',
      values: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal',
        'begins with', 'does not begin with', 'ends with', 'does not end with', 'contains', 'does not contain',
        'is null', 'is not null'],
      data: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'ew', 'en', 'cn', 'nc', 'nu', 'nn']
    },
    {
      type: 'number',
      values: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal'],
      data: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
    },
    {
      type: 'select',
      values: ['equal', 'not equal'],
      data: ['eq', 'ne']
    },
    {
      type: 'bool',
      values: ['equal', 'not equal'],
      data: ['eq', 'ne']
    }
  ];
  constructor(private dialog: MatDialog) {
  }

  openOptionPanel() {
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '496px',
      height: '100%',
      autoFocus: false,
      position: {
        right: '0'
      },
      data: {tableColumn: this.tableColumn, options: this.options}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}

@Component({
  selector: 'app-filter',
  templateUrl: 'component/filter/filter.component.html',
  styleUrls: ['component/filter/filter.component.scss']
})
export class FilterComponent implements OnInit {
  searchIndexForm: FormGroup;
  rules: FormArray;
  tableColumn = [];
  options = [];
  answers = [];
  availableAnswers = [];
  count = 0;
  type = [];
  onShow = [];
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}
  get formData() {
    return this.searchIndexForm.get('rules') as FormArray;
  }
  ngOnInit() {
    this.init();
    this.setAnswer();
  }
  init() {
    this.tableColumn = this.data.tableColumn;
    this.options = this.data.options;
    this.searchIndexForm = this.fb.group({
      groupOp: 'And',
      rules: this.fb.array([ ])
    });
    this.addControl();
    this.count = 0;
  }
  setAnswer() {
    for (let i = 0; i <  this.tableColumn.length; i++) {
      this.options.forEach(option => {
        if (this.tableColumn[i].type === option.type) {
          this.answers[i] = {
            values: option.values,
            data: option.data
          };
        }
      });
    }
    this.availableAnswers[0] = this.answers[0];
    this.type[0] = this.tableColumn[0].type;
    this.onShow[0] = 0;
  }
  createControl() {
    return this.fb.group({
      field: new FormControl('', [ Validators.required ]),
      op: new FormControl('', [ Validators.required ]),
      data: new FormControl('', [ Validators.required ])
    });
  }
  addControl() {
    this.rules = this.searchIndexForm.get('rules') as FormArray;
    this.rules.push(this.createControl());
    this.availableAnswers[this.availableAnswers.length] = this.answers[0];
    this.count++;
  }
  removeControl(i) {
    this.rules.removeAt(i);
    this.count--;
  }
  setDefault() {
    this.init();
  }
  getFilterData() {
    this.submitted = true;
    if (this.searchIndexForm.invalid) {
      return;
    }
    this.dialogRef.close(this.searchIndexForm.value);
  }
  setOption(i, count) {
    this.type[count] = this.tableColumn[i].type;
    this.availableAnswers[count] = this.answers[i];
    this.type[count + 1] = this.tableColumn[0].type;
  }
  return() {
  }
}
