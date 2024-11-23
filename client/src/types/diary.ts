export interface Diary {
  id: string | "";
  date: Date | "";
  caloriesIntake: number | "";
  energyLevel: number | "";
  vitaminsTaken: boolean | "";
  mood: string | "";
  exerciseTime: number | "";
  sleepQuality: number | "";
  waterIntake: number | "";
  notes: string | "";
  walkTime: number | "";
  stressLevel: number | "";
}

export interface Filters {
  mood: string;
  energyLevel: number;
  caloriesIntake: number | string;
  waterIntake: number | string;
  exerciseTime: number | string;
  walkTime: number | string;
  sleepQuality: number;
  stressLevel: number;
  startDate: string;
  endDate: string;
}
