
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image-drawer/image.service';
import { imageActionTypes } from '../actions/image.actions';

@Injectable()
export class ImageEffects {

    loadImages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(imageActionTypes.loadImages),
            concatMap((actions) => this.imageService.getDatas('image/photos', actions.params)),
            map((images: any) => imageActionTypes.imagesLoaded({
                images: images.data.imageList,
                count: images.data.count,
                pageNum: images.data.pageNum,
                pageSize: images.data.pageSize,
                totalPages: images.data.totalPages
            }))
        )
    );

    createImage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(imageActionTypes.createImage),
            concatMap((action) => this.imageService.post('image/photos', action.image)),
        ),
        { dispatch: false }
    );

    deleteImage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(imageActionTypes.deleteImage),
            concatMap((action) => this.imageService.delete('image/photos', action.imageId))
        ),
        { dispatch: false }
    );

    updateImage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(imageActionTypes.updateImage),
            concatMap((action) => this.imageService.update('image/photos', action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private imageService: ImageService, private actions$: Actions, private router: Router) { }
}