import { FichierMedical } from "./fichier-medical.model";

export interface TypeFichier {
  id: number;
  nom: string;
  fichiers?: FichierMedical[];
}