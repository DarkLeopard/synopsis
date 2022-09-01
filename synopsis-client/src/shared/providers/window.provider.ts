import {isPlatformBrowser} from '@angular/common';
import {
    FactoryProvider,
    InjectionToken,
    Injector,
    PLATFORM_ID,
}                          from '@angular/core';

function windowFactory(injector: Injector): Window {
    const platformId: InjectionToken<typeof PLATFORM_ID> =
        injector.get<InjectionToken<typeof PLATFORM_ID>>(PLATFORM_ID);

    return isPlatformBrowser(platformId) ? window : ({} as any);
}

export const WINDOW: InjectionToken<Window> = new InjectionToken<Window>(
    'Window',
);

export const WINDOW_PROVIDER: FactoryProvider = {
    provide: WINDOW,
    deps: [Injector],
    useFactory: windowFactory,
};
