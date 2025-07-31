import { DossierMedical } from "./dossier-medical.model";
import { TypeFichier } from "./type-fichier.model";

export interface FichierMedical {
  id: number;
  filePath: string;
  fileName: string;
  originalFileName: string;
  dateCreation: Date;
  isInternal: boolean;
  dossierId: number;
  typeFichierId?: number;
  typeFichier?: TypeFichier;
  dossier?: DossierMedical;
}