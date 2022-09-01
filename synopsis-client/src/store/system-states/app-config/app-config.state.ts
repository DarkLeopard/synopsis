import {Injectable}       from '@angular/core';
import {
    AppSDKService,
    AppSettingsSDKModel,
}                         from '@libs/clanhall-sdk';
import {undefined$}       from '@libs/shared';
import {
    Action,
    Selector,
    State,
    StateContext,
}                         from '@ngxs/store';
import {
    map,
    Observable,
    switchMap,
}                         from 'rxjs';
import {AppConfigActions} from './app-config.actions';

export interface AppConfigStateModel {
    settings: any /* AppSettingsSDKModel */
    ;
}

@State<AppConfigStateModel>({
    name: 'appConfig',
    defaults: {
        settings: undefined,
    },
})
@Injectable()
export class AppConfigState {

    @Selector()
    public static getState(state: AppConfigStateModel) {
        return state;
    }

    @Selector()
    public static getCmsSettings(state: AppConfigStateModel): AppConfigStateModel['settings'] {
        return state.settings;
    }

    @Action(AppConfigActions.GetAppConfig)
    public getAppConfig(context: StateContext<AppConfigStateModel>): Observable<void> {
        return this.appSDKService.applicationSettings().pipe(
            switchMap((response: AppSettingsSDKModel) => {
                return context.dispatch(new AppConfigActions.SetAppConfig(response));
            }),
            map(() => undefined),
        );
    }

    @Action(AppConfigActions.SetAppConfig)
    public setAppConfig(
        context: StateContext<AppConfigStateModel>,
        {payload}: AppConfigActions.SetAppConfig,
    ): Observable<void> {
        context.patchState({
            settings: payload,
        });
        return undefined$();
    }
}
