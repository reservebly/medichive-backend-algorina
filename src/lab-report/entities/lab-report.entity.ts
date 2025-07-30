export class LabReport {
  id: number;
  patientId: number;
  labId?: number;
  description: string;
  reportLink?: string;
  imagePath?: string;
  pdfPath?: string;
  createdAt: Date;
  updatedAt: Date;
}
