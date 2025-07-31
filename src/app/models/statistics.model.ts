export interface DossierStatistics {
  totalDossiers: number;
  dossiersParDepartement: {
    departementId: number;
    departementNom: string;
    nombreDossiers: number;
  }[];
  dossiersParMois: {
    annee: number;
    mois: number;
    nombreDossiers: number;
  }[];
  totalFichiers: number;
}