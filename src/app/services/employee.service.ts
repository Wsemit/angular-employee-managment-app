import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly STORAGE_KEY = 'employees';
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const currentEmployees = this.employeesSubject.value;
    if (currentEmployees.length === 0) {
      // Add sample employees if none exist
      const sampleEmployees: Employee[] = [
        {
          id: 1,
          fullName: 'John Smith',
          email: 'john.smith@example.com',
          position: 'Developer',
          startDate: new Date('2022-01-15'),
          skills: [
            { skill: 'Angular', yearExperience: 3 },
            { skill: 'TypeScript', yearExperience: 4 },
            { skill: 'RxJS', yearExperience: 2 }
          ]
        },
        {
          id: 2,
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          position: 'Designer',
          startDate: new Date('2021-06-20'),
          skills: [
            { skill: 'CSS', yearExperience: 5 },
            { skill: 'HTML', yearExperience: 6 }
          ]
        },
        {
          id: 3,
          fullName: 'Mike Wilson',
          email: 'mike.wilson@example.com',
          position: 'QA',
          startDate: new Date('2023-03-10'),
          skills: [
            { skill: 'TypeScript', yearExperience: 2 },
            { skill: 'Angular', yearExperience: 1 }
          ]
        },
        {
          id: 4,
          fullName: 'Emily Davis',
          email: 'emily.davis@example.com',
          position: 'Manager',
          startDate: new Date('2020-09-05'),
          skills: [
            { skill: 'Angular', yearExperience: 5 },
            { skill: 'TypeScript', yearExperience: 5 },
            { skill: 'RxJS', yearExperience: 4 },
            { skill: 'CSS', yearExperience: 3 }
          ]
        }
      ];

      this.employeesSubject.next(sampleEmployees);
      this.saveToStorage(sampleEmployees);
    }
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const employees = JSON.parse(stored).map((emp: any) => ({
          ...emp,
          startDate: new Date(emp.startDate)
        }));
        this.employeesSubject.next(employees);
      } catch (error) {
        console.error('Error loading employees from storage:', error);
        this.employeesSubject.next([]);
      }
    }
  }

  private saveToStorage(employees: Employee[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
  }

  getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const currentEmployees = this.employeesSubject.value;
    const newId = Math.max(0, ...currentEmployees.map(emp => emp.id)) + 1;
    const newEmployee: Employee = { ...employee, id: newId };
    const updatedEmployees = [...currentEmployees, newEmployee];

    this.employeesSubject.next(updatedEmployees);
    this.saveToStorage(updatedEmployees);
  }

  updateEmployee(updatedEmployee: Employee): void {
    const currentEmployees = this.employeesSubject.value;
    const index = currentEmployees.findIndex(emp => emp.id === updatedEmployee.id);

    if (index !== -1) {
      const updatedEmployees = [...currentEmployees];
      updatedEmployees[index] = updatedEmployee;

      this.employeesSubject.next(updatedEmployees);
      this.saveToStorage(updatedEmployees);
    }
  }

  deleteEmployee(id: number): void {
    const currentEmployees = this.employeesSubject.value;
    const updatedEmployees = currentEmployees.filter(emp => emp.id !== id);

    this.employeesSubject.next(updatedEmployees);
    this.saveToStorage(updatedEmployees);
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employeesSubject.value.find(emp => emp.id === id);
  }
}
