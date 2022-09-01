import {StateClass} from '@ngxs/store/internals';
import {NgxsConfig} from '@ngxs/store/src/symbols';
import {environment} from '../environments/environment';

const SYSTEM_STATES: StateClass[] = [];

export const STATES_MODULES: StateClass[] = [...SYSTEM_STATES];

export const OPTIONS_CONFIG: Partial<NgxsConfig> = {
  developmentMode: !environment.production,
};

// export const DEVTOOLS_REDUX_CONFIG: NgxsDevtoolsOptions = {
//     disabled: environment.production,
// };

// export const LOGGER_CONFIG: NgxsLoggerPluginOptions = {
//     disabled: true,
//     collapsed: true,
// };

// export const STORAGE_CONFIG: NgxsStoragePluginOptions = {
//     key: [],
// };
