import { Catalogos } from '../historia-clinica/catalogos';
import { Unidad } from '../historia-clinica/unidad';

export class SolicitudResumenClinico {
  solicitudResumenId	?:number;
  codigoSolicitud	?:string;
  unidadSalud	?:Unidad;
  expedienteId	?:number;
  fechaSolicitud	?:Date;
  fechaProbaEntrega	?:Date;
  solicitanteId	?:number;
  tipoSolicitante	?:Catalogos;
  institucionId	?:Catalogos;
  parentesco	?:Catalogos;
  telefono	?:number;
  correo	?:string;
  motivoSolicitud	?:Catalogos;
  motivoOtros	?:string;
  especialidad	?:Catalogos;
  estadoSolicitud	?:Catalogos;
  observaciones	?:string;
  estadoRegistro	?:number;
  usuarioRegistro	?:string;
  usuarioModificacion	?:string;
  fechaRegistro	?:Date;
  paciente?:string;
  solicitante?:string;
}
