import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext,} from '@ngxs/store';
import {Observable} from 'rxjs';
import {LocalStorageKeys} from '../../../../shared/enums/storage-keys';
import {undefined$} from '../../../../shared/functions/void-observable';
import {DatabaseNamesEnum} from '../../database-names';
import {LocalStorageActions} from './local-storage.actions';
import {getItemLS} from "../../../../shared/functions/local-storage";

export type LocalStorageStateModel = {
  [key in LocalStorageKeys]: string | null;
}

const getDefaults: () => LocalStorageStateModel = () => {
  return {
    [LocalStorageKeys.Language]: getItemLS(LocalStorageKeys.Language),
  };
};

@State<LocalStorageStateModel>({
  name: DatabaseNamesEnum.LocalStorage,
  defaults: getDefaults(),
})
@Injectable()
export class LocalStorageState {
  @Selector()
  public static getLang(state: LocalStorageStateModel): LocalStorageStateModel['language'] {
    return state[LocalStorageKeys.Language];
  }

  @Action(LocalStorageActions.SetItem)
  public setItem(
    context: StateContext<LocalStorageStateModel>,
    {key, value}: LocalStorageActions.SetItem,
  ): Observable<void> {
    this.setItemLS(key, value);
    context.patchState({[key]: value});
    return undefined$();
  }

  private getItemLS<T = string>(key: LocalStorageKeys): T | null {
    return localStorage.getItem(key) as unknown as T;
  }

  private setItemLS(key: LocalStorageKeys, value: string): void {
    localStorage.setItem(key, value);
  }
}
