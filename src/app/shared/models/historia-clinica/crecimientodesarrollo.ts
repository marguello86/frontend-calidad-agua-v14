import { AntecedentesPsicomotor } from './antecedentes-psicomotor';
import { AntecedentesSocioEconomicos } from './antecedentes-socio-economicos';
import { AntecedentesPostnatales } from './antecedentes-postnatales';
import { AntecedentesParto } from './antecedentes-parto';
import { AlimentacionPediatrica } from './alimentacion-pediatrica';
export class Crecimientodesarrollo {
  alimentacion?: AlimentacionPediatrica;
  antecedentesParto?: AntecedentesParto;
  antecedentesPostnatales?: AntecedentesPostnatales;
  antecedentesSocioeconomico?: AntecedentesSocioEconomicos;
  desarrolloPsicomotor?: AntecedentesPsicomotor;
}
