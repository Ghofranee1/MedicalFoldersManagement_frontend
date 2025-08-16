import { DossierMedical } from "./dossier-medical.model";

export interface Departement {
    id: number;
    libelleFr: string;
    libelleAr?: string;
    abreviationFr: string;
    abreviationAr?: string;
    reference?: string;
    status: number;
    dossiers?: DossierMedical[];
}