import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext,} from '@ngxs/store';
import * as localforage from 'localforage';
import {catchError, forkJoin, Observable, Subscriber, switchMapTo, tap,} from 'rxjs';
import {StorageKeys, StorageKeysType} from '../../../../shared/enums/storage-keys';
import {undefined$} from '../../../../shared/functions/void-observable';
import {DatabaseNamesEnum} from '../../database-names';
import {JsonDBActions} from './jsondb-storage.actions';
import {IBasicModel} from "../../../../shared/models/basic/basic-model.interface";
import {getEnumKeys} from "../../../../shared/functions/get-enum-keys";
import {saveAs} from 'file-saver';

export interface JsonDBStateModel extends StorageKeysType<IBasicModel[]> {
  isInit: boolean;
}

const getDefaults: () => JsonDBStateModel = () => {
  return {
    isInit: false,
    [StorageKeys.Pages]: [],
  };
};

@State<JsonDBStateModel>({
  name: DatabaseNamesEnum.Json,
  defaults: getDefaults(),
})
@Injectable()
export class JsonDBState {
  @Selector()
  public static isInit(state: JsonDBStateModel): JsonDBStateModel['isInit'] {
    return state.isInit;
  }

  // TODO: добавить дженерик запрос по StorageKeys

  @Action(JsonDBActions.SetItem)
  public setItem(
    context: StateContext<JsonDBStateModel>,
    {key, value}: JsonDBActions.SetItem,
  ): Observable<void> {
    context.patchState({[key]: value});
    return this.setItemDB(key, value);
  }

  @Action(JsonDBActions.Restore)
  public restore(
    context: StateContext<JsonDBStateModel>,
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

  private createNewDBIndexFile(): void {
    const indexFile = {};
    this.saveJson('index-db.json', JSON.stringify(indexFile));
  }

  private saveJson(fileName: string, fileString: string) {
    const blob = new Blob([fileString], {type: 'application/json'});
    saveAs(blob, fileName);
  }

  private loadJson<T>(file: File): Observable<any> {
    return new Observable((subscriber: Subscriber<T | null>) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = (event: ProgressEvent<FileReader>) => {
        const result = JSON.parse(event.target?.result as string);
        subscriber.next(result);
        subscriber.complete();
      };
      reader.onerror = (error: ProgressEvent<FileReader>) => {
        subscriber.error(error);
        subscriber.complete();
      };
      reader.readAsText(file);
    });
  }
}
