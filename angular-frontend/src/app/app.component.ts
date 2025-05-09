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

  addUser() {
    this.http.post<any>(
      'https://celescontainerwebapp-gbb0eccffyfkg4hc.westus3-01.azurewebsites.net/users',
      { name: this.name }
    ).subscribe(() => {
      this.name = '';
      this.fetchUsers();
    });
  }

  fetchUsers() {
    this.http.get<any[]>(
      'https://celescontainerwebapp-gbb0eccffyfkg4hc.westus3-01.azurewebsites.net/users'
    ).subscribe(data => {
      this.users = data;
    });
  }
}
