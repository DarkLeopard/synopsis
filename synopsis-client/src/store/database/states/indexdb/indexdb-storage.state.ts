import {Injectable} from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import * as localforage from 'localforage';
import {
  catchError,
  forkJoin,
  Observable,
  Subscriber,
  switchMapTo,
  tap,
} from 'rxjs';
import {StorageKeys, StorageKeysType} from '../../../../shared/enums/storage-keys';
import {undefined$} from '../../../../shared/functions/void-observable';
import {DatabaseNamesEnum} from '../../database-names';
import {IndexDBActions} from './indexdb-storage.actions';
import {IBasicModel} from "../../../../shared/models/basic/basic-model.interface";
import {getEnumKeys} from "../../../../shared/functions/get-enum-keys";

export interface IndexDBStateModel extends StorageKeysType<IBasicModel[]> {
  isInit: boolean;
}

const getDefaults: () => IndexDBStateModel = () => {
  return {
    isInit: false,
    [StorageKeys.Pages]: [],
  };
};

@State<IndexDBStateModel>({
  name: DatabaseNamesEnum.IndexDB,
  defaults: getDefaults(),
})
@Injectable()
export class IndexDBState {
  @Selector()
  public static isInit(state: IndexDBStateModel): IndexDBStateModel['isInit'] {
    return state.isInit;
  }

  // TODO: добавить дженерик запрос по StorageKeys

  @Action(IndexDBActions.SetItem)
  public setItem(
    context: StateContext<IndexDBStateModel>,
    {key, value}: IndexDBActions.SetItem,
  ): Observable<void> {
    context.patchState({[key]: value});
    return this.setItemDB(key, value);
  }

  @Action(IndexDBActions.Restore)
  public restore(
    context: StateContext<IndexDBStateModel>,
  ): Observable<void> {
    return forkJoin(
      getEnumKeys<keyof StorageKeysType<unknown>>(StorageKeys)
        .map((storageItem) => {
          return this.getItemDB<IBasicModel[]>(storageItem)
            .pipe(
              tap((value) => {
                context.patchState({[storageItem]: value || []});
                if (!value) {
                  console.warn('No data in storage: ', storageItem);
                }
              }),
            );
        })
    )
      .pipe(
        tap(() => {
          context.patchState({isInit: true});
        }),
        catchError((error, caught) => {
          console.error('Error from storage DB', error);
          return caught;
        }),
        switchMapTo(undefined$()),
      );
  }

  private setItemDB<T>(key: StorageKeys, value: T): Observable<T> {
    return new Observable((subscriber: Subscriber<T>) => {
      localforage.setItem(key, value)
        .then((promiseResult: T) => {
          subscriber.next(promiseResult);
        })
        .catch((error: unknown) => {
          console.error('localforage error', error);
          subscriber.error(error);
        })
        .finally(() => {
          subscriber.complete();
        });
    });
  }

  private getItemDB<T>(key: keyof StorageKeysType<unknown>): Observable<T | null> {
    return new Observable((subscriber: Subscriber<T | null>) => {
      localforage.getItem<T>(key)
        .then((promiseResult: T | null) => {
          subscriber.next(promiseResult);
        })
        .catch((error: unknown) => {
          subscriber.error(error);
        })
        .finally(() => {
          subscriber.complete();
        });
    });
  }
}
