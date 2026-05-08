import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  constructor(public notificationService: NotificationService) {}
}
