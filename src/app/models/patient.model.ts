import { DossierMedical } from "./dossier-medical.model";

export interface Patient {
  ipp: string;
  nomFr: string;
  prenomFr: string;
  prenomPereFr?: string;
  nomAr?: string;
  prenomAr?: string;
  prenomPereAr?: string;
  dateNaissance: Date;
  lieuNaissance?: string;
  sexe: string;
  numeroCIN?: string;
  phone1?: string;
  phone2?: string;
  adresseFr?: string;
  gouvernoratHabitat?: string;
  email?: string;
  photo?: string;
  isActive: boolean;
  statutPermenant?: boolean;
  statutVip?: boolean;
  isConfidential?: boolean;
  ippParent?: string;
  mere?: Patient;
  dossiers?: DossierMedical[];
}