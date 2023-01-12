import { Injector } from '@angular/core';

export class RestAppInjector {
  private static _injector: Injector;

  static setInjector(injector: Injector) { RestAppInjector._injector = injector; }

  static getInjector(): Injector { return RestAppInjector._injector; }
}
