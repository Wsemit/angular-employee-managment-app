import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Employee, POSITIONS, AVAILABLE_SKILLS } from '../../models/employee.interface';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Input() employeeToEdit: Employee | null = null;
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  employeeForm!: FormGroup;
  positions = POSITIONS;
  availableSkills = AVAILABLE_SKILLS;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.employeeToEdit;
    this.initializeForm();

    if (this.employeeToEdit) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      skills: this.fb.array([])
    });

    // Add initial skill row
    this.addSkill();
  }

  private populateForm(): void {
    if (this.employeeToEdit) {
      this.employeeForm.patchValue({
        fullName: this.employeeToEdit.fullName,
        email: this.employeeToEdit.email,
        position: this.employeeToEdit.position,
        startDate: this.formatDateForInput(this.employeeToEdit.startDate)
      });

      // Clear skills array and populate with existing skills
      this.clearSkills();
      this.employeeToEdit.skills.forEach(skill => {
        this.addSkill(skill.skill, skill.yearExperience);
      });
    }
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  get skills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkill(skill: string = '', yearExperience: number = 0): void {
    const skillGroup = this.fb.group({
      skill: [skill, Validators.required],
      yearExperience: [yearExperience, [Validators.required, Validators.min(0)]]
    });
    this.skills.push(skillGroup);
  }

  removeSkill(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  private clearSkills(): void {
    while (this.skills.length !== 0) {
      this.skills.removeAt(0);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${controlName} is required`;
      if (control.errors['minlength']) return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['email']) return 'Please enter a valid email';
    }
    return '';
  }

  getSkillErrorMessage(index: number, field: string): string {
    const control = this.skills.at(index)?.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['min']) return `${field} must be 0 or greater`;
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control?.errors && control.touched);
  }

  isSkillFieldInvalid(index: number, field: string): boolean {
    const control = this.skills.at(index)?.get(field);
    return !!(control?.errors && control.touched);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData = {
        ...formValue,
        startDate: new Date(formValue.startDate)
      };

      if (this.isEditMode && this.employeeToEdit) {
        this.employeeService.updateEmployee({
          ...employeeData,
          id: this.employeeToEdit.id
        });
      } else {
        this.employeeService.addEmployee(employeeData);
      }

      this.formSubmitted.emit();
      this.resetForm();
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onCancel(): void {
    this.formCancelled.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.employeeForm.reset();
    this.clearSkills();
    this.addSkill();
    this.isEditMode = false;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(nestedKey => {
              arrayControl.get(nestedKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }
}
