import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = '';
  users: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ Fetch users only in browser (not during build/prerender)
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUsers();
    }
  }

  fetchUsers() {
    this.http.get<any[]>('/users').subscribe((data) => {
      this.users = data;
    });
  }

  addUser() {
    if (!this.name.trim()) return;
    this.http.post<any>('/users', { name: this.name }).subscribe((newUser) => {
      this.users.push(newUser);
      this.name = '';
    });
  }
}


  // fetchUsers() {
  //   this.http.get<any[]>('http://localhost:5000/users').subscribe(data => {
  //     this.users = data;
  //   });
  // }

  // addUser() {
  //   if (!this.name.trim()) return;
  //   this.http.post<any>('http://localhost:5000/users', { name: this.name }).subscribe(newUser => {
  //     this.users.push(newUser);
  //     this.name = '';
  //   });
  // }

