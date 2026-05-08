import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { NotificationService } from '../../services/notification.service';
import { ITEM_CATEGORIES, ItemType } from '../../models/item.model';

@Component({
  selector: 'app-report-item',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './report-item.html',
  styleUrl: './report-item.scss',
})
export class ReportItemComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private itemService = inject(ItemService);
  private notificationService = inject(NotificationService);

  itemType: ItemType = 'lost';
  categories = ITEM_CATEGORIES;
  form!: FormGroup;

  ngOnInit(): void {
    this.itemType = this.route.snapshot.data['itemType'] ?? 'lost';
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      reporterName: ['', Validators.required],
      reporterEmail: ['', [Validators.required, Validators.email]],
      reporterPhone: ['', Validators.required],
    });
  }

  get isLost(): boolean {
    return this.itemType === 'lost';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newItem = this.itemService.addItem({
      ...this.form.value,
      type: this.itemType,
    });

    this.notificationService.show(
      `${this.isLost ? 'Lost' : 'Found'} item "${newItem.title}" reported successfully!`,
      'success'
    );
    this.router.navigate(['/items', newItem.id]);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!control && control.hasError(error) && control.touched;
  }
}
