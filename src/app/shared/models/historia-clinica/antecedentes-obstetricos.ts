import { Catalogos } from './catalogos';

export class AntecedentesObstetricos {
  anteObstetricoId?: number;
  furConoce?: Catalogos;
  furFecha?: Date;
  ciclosRegulares?: Catalogos;
  dismenorrea?: Catalogos;
  semanaAmenorrea?: number;
  menopausia?: Catalogos;
  fechaMenopausia?: Date;
  sustitucionHormonal?: Catalogos;
  situacionHormonalDescripcion?: string;
  pap?: Catalogos;
  papResultados?: string;
  papUltimaFecha?: Date;
  gesta?: number;
  para?: number;
  cesarea?: number;
  aborto?: number;
  legrado?: number;
  embarazos?: number;
}
