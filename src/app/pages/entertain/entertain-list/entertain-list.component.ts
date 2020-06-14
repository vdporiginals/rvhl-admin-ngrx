import { Component, OnInit } from '@angular/core';
import { IEntertain } from 'src/app/models/entertain.interface';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-entertain-list',
  templateUrl: './entertain-list.component.html',
  styleUrls: ['./entertain-list.component.scss']
})
export class EntertainListComponent implements OnInit {
  total = 1;
  listEntertain: IEntertain[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterStatus = [
    { text: 'Kích hoạt', value: 'true' },
    { text: 'Chưa kích hoạt', value: 'false' }
  ];
  size: NzButtonSize = 'default';

  constructor() { }

  ngOnInit(): void {
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    // this.randomUserService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
    //   this.loading = false;
    //   this.total = 200; // mock the total data here
    //   this.listEntertain = data.results;
    // });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

}
