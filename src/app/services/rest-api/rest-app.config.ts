import { environment } from "src/environments/environment";

const _TRUE: boolean = (!environment.production && true);
const _FALSE: boolean = (!environment.production && false);

export const restAppConfig = {
  logger: {
    construct: _FALSE,
    init: _FALSE,
    destroy: _FALSE,
    info: _FALSE,
    error: _TRUE,
    session: _FALSE,
    fnCall: _FALSE,
    /* ---------- */
    valueChanges: _FALSE,
    actionEvents: _FALSE,
    http: {
      info: _FALSE,
      caching: _FALSE,
      noGetData: _FALSE,
      error: _TRUE
    }
  }
};

