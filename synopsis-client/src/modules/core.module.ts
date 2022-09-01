import {APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Store} from "@ngxs/store";
import {WINDOW_PROVIDER} from "../shared/providers/window.provider";
import {forkJoin, Observable} from "rxjs";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

function appInit(store: Store): () => Observable<unknown> | Promise<unknown> {
  return () =>
    forkJoin([
      // store.dispatch(new AppConfigActions.GetAppConfig()),
    ]);
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }

  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        WINDOW_PROVIDER,
        // ...INTERCEPTORS,
        {
          provide: APP_INITIALIZER,
          useFactory: appInit,
          deps: [Store],
          multi: true,
        },
      ],
    };
  }
}
