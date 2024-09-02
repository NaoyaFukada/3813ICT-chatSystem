import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chatSystem';

  constructor(private router: Router) {}

  logout() {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
