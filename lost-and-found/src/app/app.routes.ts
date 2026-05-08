import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ReportItemComponent } from './components/report-item/report-item';
import { ItemsListComponent } from './components/items-list/items-list';
import { ItemDetailComponent } from './components/item-detail/item-detail';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'report/lost', component: ReportItemComponent, data: { itemType: 'lost' } },
  { path: 'report/found', component: ReportItemComponent, data: { itemType: 'found' } },
  { path: 'items', component: ItemsListComponent },
  { path: 'items/:id', component: ItemDetailComponent },
  { path: '**', redirectTo: '' },
];
