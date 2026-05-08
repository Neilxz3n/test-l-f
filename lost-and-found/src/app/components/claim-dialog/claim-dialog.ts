import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-claim-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './claim-dialog.html',
  styleUrl: './claim-dialog.scss',
})
export class ClaimDialogComponent {
  @Output() submitted = new EventEmitter<{ claimedBy: string; description: string }>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    claimedBy: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!control && control.hasError(error) && control.touched;
  }
}
