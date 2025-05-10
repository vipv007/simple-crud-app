import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // ✅ required modules
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = '';
  users: any[] = [];

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:5000/users').subscribe(data => {
      this.users = data;
    });
  }

  addUser() {
    if (!this.name.trim()) return;
    this.http.post<any>('http://localhost:5000/users', { name: this.name }).subscribe(newUser => {
      this.users.push(newUser);
      this.name = '';
    });
  }
}
