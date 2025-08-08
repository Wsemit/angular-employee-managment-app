import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, Subject, combineLatest, map, startWith } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Employee, SortField, SortDirection } from '../../models/employee.interface';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmployeeCardComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  @Input() customCardTemplate: TemplateRef<any> | null = null;
  @Output() editEmployee = new EventEmitter<Employee>();

  searchControl = new FormControl('');
  sortField: SortField = 'fullName';
  sortDirection: SortDirection = 'asc';

  private sortSubject = new Subject<{ field: SortField; direction: SortDirection }>();
  private destroy$ = new Subject<void>();

  filteredAndSortedEmployees$: Observable<Employee[]>;

  constructor(private employeeService: EmployeeService) {
    // Initialize the observable pipeline
    this.filteredAndSortedEmployees$ = this.createFilteredAndSortedEmployees$();
  }

  ngOnInit(): void {
    // Initialize sort
    this.sortSubject.next({ field: this.sortField, direction: this.sortDirection });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFilteredAndSortedEmployees$(): Observable<Employee[]> {
    // Search observable with RxJS operators
    const searchTerm$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(term => (term || '').toLowerCase().trim())
    );

    // Sort observable
    const sort$ = this.sortSubject.pipe(
      startWith({ field: this.sortField, direction: this.sortDirection })
    );

    // Combine employees, search, and sort
    return combineLatest([
      this.employeeService.getEmployees(),
      searchTerm$,
      sort$
    ]).pipe(
      map(([employees, searchTerm, sort]) => {
        // Filter by search term
        let filtered = employees;
        if (searchTerm) {
          filtered = employees.filter(employee =>
            employee.fullName.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm)
          );
        }

        // Sort the filtered results
        return this.sortEmployees(filtered, sort.field, sort.direction);
      })
    );
  }

  private sortEmployees(employees: Employee[], field: SortField, direction: SortDirection): Employee[] {
    return [...employees].sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case 'fullName':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'skillsCount':
          comparison = a.skills.length - b.skills.length;
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  onSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.sortSubject.next({ field: this.sortField, direction: this.sortDirection });
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  onEditEmployee(employee: Employee): void {
    this.editEmployee.emit(employee);
  }

  onDeleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      this.employeeService.deleteEmployee(employee.id);
    }
  }

  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.id;
  }
}
