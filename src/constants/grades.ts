export interface GradeData {
  id: number;
  label: string;
  progress: number;
}

export const GRADES: GradeData[] = [
  { id: 1, label: 'Khối 1', progress: 100 },
  { id: 2, label: 'Khối 2', progress: 92 },
  { id: 3, label: 'Khối 3', progress: 88 },
  { id: 4, label: 'Khối 4', progress: 75 },
  { id: 5, label: 'Khối 5', progress: 60 },
];
