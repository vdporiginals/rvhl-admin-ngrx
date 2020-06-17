
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { categoryActionTypes } from '../actions/category.actions';
import { CategoryService } from 'src/app/pages/category/category.service';

@Injectable()
export class CategoryEffects {

    loadCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(categoryActionTypes.loadCategories),
            concatMap((actions) => this.categoryService.getDatas(actions.routeName, actions.params).pipe(map((res) => {
                return {
                    routeName: actions.routeName,
                    data: res
                };
            }))),
            map((categories: any) => {
                return categoryActionTypes.categoriesLoaded({
                    routeName: categories.routeName,
                    categories: categories.data.data
                });
            })
        )
    );

    createCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(categoryActionTypes.createCategory),
            concatMap((action) => {
                console.log(action)
                return this.categoryService.create(action.routeName, action.category)
            }),
        ),
        { dispatch: false }
    );

    deleteCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(categoryActionTypes.deleteCategory),
            concatMap((action) => this.categoryService.delete(action.routeName, action.categoryId))
        ),
        { dispatch: false }
    );

    updateCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(categoryActionTypes.updateCategory),
            concatMap((action) => this.categoryService.update(action.routeName, action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private categoryService: CategoryService, private actions$: Actions, private router: Router) { }
}
