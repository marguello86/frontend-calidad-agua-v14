// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  local: true,
  version: '2.0.0',
  /**
   * Rutas Absolutas
   */
  urlWsCatalogosMinsa:
    'https://portaldev.minsa.gob.ni/wscatalogosminsa/v2/catalogos/',
  urlWsVigilanciaMinsa:
    'https://portaldev.minsa.gob.ni/wsvigilanciaminsa/v1/vigilancia/',
  urlWsHospitalario:
    'https://portaldev.minsa.gob.ni/wshospitalariominsa/v2/hospitalario/',
  urlPersona:
    'https://portaldev.minsa.gob.ni/wspersonas/v2/hospitalario/personas/',
  urlPaciente: 'https://portaldev.minsa.gob.ni/wspacienteminsa/v2/',
  urlSeguridad: 'https://portaldev.minsa.gob.ni/wsseguridad/v1/seguridad/',
  urlMinsaPersonales:
    'https://portaldev.minsa.gob.ni/wscatalogosminsa/v2/catalogos/minsapersonales/minsapersonales/',
  urlEmergencia:
    'https://portaldev.minsa.gob.ni/wsemergenciav2/v1/emergencia/gestion/',
  urlSIPAI: 'https://portaldev.minsa.gob.ni/wssipai/',
  urlCirugia: 'https://portaldev.minsa.gob.ni/wsquirofanominsa/v1/hospitalario/',
  urlHistoriaClinica:
    'https://portaldev.minsa.gob.ni/wshistoriaclinica/v1/historiaclinica/gestion/',
  /**
   * Rutas Relativas
   */

  // urlWsCatalogosMinsa: '/wscatalogosminsa/v2/catalogos/',
  // urlWsVigilanciaMinsa: '/wsvigilanciaminsa/v1/vigilancia/',
  // urlWsHospitalario: '/wshospitalariominsa/v2/hospitalario/',
  // urlPersona: '/wspersonas/v2/hospitalario/personas/',
  // urlPaciente: '/wspacienteminsa/v2/',
  // urlSeguridad: '/wsseguridad/v1/seguridad/',
  // urlMinsaPersonales:
  //   '/wscatalogosminsa/v2/catalogos/minsapersonales/minsapersonales/',
  // urlEmergencia: '/wsemergenciav2/v1/emergencia/gestion/',
  // urlSIPAI: '/wssipai/',
  // urlHistoriaClinica: '/wshistoriaclinica/v1/historiaclinica/gestion/',
};
