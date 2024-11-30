export interface Diary {
  _id: string;
  date: Date;
  caloriesIntake: number;
  energyLevel: number;
  vitaminsTaken: boolean;
  mood: string;
  exerciseTime: number;
  sleepQuality: number;
  waterIntake: number;
  notes: string;
  walkTime: number;
  stressLevel: number;
}

export interface Filters {
  mood: string;
  energyLevel: number;
  caloriesIntake: number;
  waterIntake: number;
  exerciseTime: number;
  walkTime: number;
  sleepQuality: number;
  stressLevel: number;
  startDate: string;
  endDate: string;
}
