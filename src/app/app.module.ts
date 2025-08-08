import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from './models/employee.interface';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent, EmployeeListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('customCardTemplate', { static: true }) customCardTemplate!: TemplateRef<any>;

  currentView: 'list' | 'form' = 'list';
  selectedEmployee: Employee | null = null;
  useCustomTemplate = false;

  onAddEmployee(): void {
    this.selectedEmployee = null;
    this.currentView = 'form';
  }

  onEditEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.currentView = 'form';
  }

  onFormSubmitted(): void {
    this.currentView = 'list';
    this.selectedEmployee = null;
  }

  onFormCancelled(): void {
    this.currentView = 'list';
    this.selectedEmployee = null;
  }

  toggleTemplate(): void {
    this.useCustomTemplate = !this.useCustomTemplate;
  }

  getCustomTemplate(): TemplateRef<any> | null {
    return this.useCustomTemplate ? this.customCardTemplate : null;
  }

  formatCustomDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getTotalExp(employee: Employee): number {
    return employee.skills.reduce((total, skill) => total + skill.yearExperience, 0);
  }
}
