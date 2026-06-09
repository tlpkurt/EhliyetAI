export interface Question {
  id: number;
  kategori: string;
  soru: string;
  secenekler: string[];
  dogruCevap: number;
  aciklama?: string;
}
