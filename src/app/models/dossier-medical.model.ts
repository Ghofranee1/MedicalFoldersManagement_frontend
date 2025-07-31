import { Departement } from "./departement.model";
import { FichierMedical } from "./fichier-medical.model";
import { Patient } from "./patient.model";

export interface DossierMedical {
  id: number;
  ipp: string;
  departementId: number;
  dateCreation: Date;
  patient?: Patient;
  departement?: Departement;
  fichiers?: FichierMedical[];
  nombreFichiers?: number;
}