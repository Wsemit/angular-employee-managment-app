export interface Skill {
  skill: string;
  yearExperience: number;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  position: string;
  skills: Skill[];
  startDate: Date;
}

export type Position = 'Developer' | 'Designer' | 'QA' | 'Manager';

export const POSITIONS: Position[] = ['Developer', 'Designer', 'QA', 'Manager'];

export const AVAILABLE_SKILLS = ['Angular', 'RxJS', 'TypeScript', 'CSS', 'HTML'];

export type SortField = 'fullName' | 'startDate' | 'skillsCount';
export type SortDirection = 'asc' | 'desc';
