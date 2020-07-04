import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedDataService } from '../services/shared-data.service';
import { ImageService } from './image.service';
import { Store, select } from '@ngrx/store';
import { areImagesLoaded, getAllImages, getPagination } from 'src/app/store/selectors/image.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { loadImages, imagesLoaded } from 'src/app/store/actions/image.actions';
import { Observable } from 'rxjs';
import { IImage } from 'src/app/models/image.interface';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-image-drawer',
  templateUrl: './image-drawer.component.html',
  styleUrls: ['./image-drawer.component.scss']
})
export class ImageDrawerComponent implements OnInit {
  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
  uploadForm: FormGroup;
  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };
  listFolder: any;
  imageList$: Observable<any[]>;
  sizeImg: string;
  pagination$: Observable<IImage>;
  childrenVisible = false;

  currentPageImage: number;
  countImage: number;
  isLastPageImage = false;
  isFirstPageImage = false;
  currentPage: number;
  count: number;
  limit = 16;
  isLastPage = false;
  isFirstPage = false;
  constructor(private fb: FormBuilder, private store: Store, private drawerRef: NzDrawerRef<string>,
    private sharedData: SharedDataService, private api: ImageService) {
    this.uploadForm = this.fb.group({
      image: ['']
    });
  }
  ngOnInit(): void {
    this.getGalleries(1);
    this.getPhotosDefault(1);
    // this.imageList$ = this.store.select(getAllImages);
  }

  closeChildren(): void {
    this.childrenVisible = false;
  }

  getPhotosDefault(page) {
    this.store.dispatch(loadImages({
      params: {
        limit: 16,
        page,
        size: 'm'
      }
    }));
    this.imageList$ = this.store.select(getAllImages);
    this.pagination$ = this.store.select(getPagination);
    this.pagination$.subscribe(res => {
      this.currentPageImage = res.pageNum;
      this.limit = res.pageSize;
      this.count = res.count;
    });
  }

  getGalleries(page) {
    const params = {
      page,
      limit: 8
    };
    this.api.getDatas('image/gallery', params).subscribe((res: any) => {
      this.listFolder = res.data.galleryList;
      this.count = res.data.count;
      // console.log(res);
      // if (page === res.data.totalPages) {
      //   this.isLastPage = true;
      //   this.currentPage = res.data.totalPages;
      // } else {
      //   this.isLastPage = true;
      //   this.currentPage = page;
      // }

      // if (page === 1) {
      //   this.isFirstPage = true;
      // } else {
      //   this.isFirstPage = false;
      // }
    });
  }

  chooseImage(link, size?) {
    const newLink = link.replace(`_m`, `_${size}`);
    this.drawerRef.close(newLink);
    // this.store.dispatch(loadImages({
    //   params: {
    //     limit: 12,
    //     page,
    //     size: 'm'
    //   }
    // }));
    // this.api.getData(id, 'image/photos', null, null, null, size).subscribe((res: any) => {
    //   this.sharedData.setImageLink(res.data.link);
    // });
  }

  uploadImage(ev?) {
    if (ev.target.files.length > 0) {
      const file = ev.target.files[0];
      console.log(file);
      this.uploadForm.get('image').setValue(file);
      this.onSubmit();

    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('image', this.uploadForm.get('image').value);
    this.api.post('image/photos', formData).subscribe(res => {
      // console.log(res);
      this.getPhotosDefault(12);
    });

  }
}
