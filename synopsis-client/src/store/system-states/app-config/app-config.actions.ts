import {AppConfigStateModel} from './app-config.state';

export namespace AppConfigActions {
    const ACTION_NAME: string = '[AppConfig]';

    export class GetAppConfig {
        public static readonly type: string = `${ACTION_NAME} Get application configuration.`;
    }

    export class SetAppConfig {
        public static readonly type: string = `${ACTION_NAME} Set application configuration.`;

        constructor(public payload: AppConfigStateModel['settings']) {
        }
    }
}
