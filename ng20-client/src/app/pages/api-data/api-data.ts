import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ApiService, Post } from '../../core/api.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  template: `
    <h2>API Data</h2>
    <p>Fetching posts from JSONPlaceholder.</p>

    <button (click)="reload()">Reload</button>

    <p *ngIf="loading()">Loading…</p>
    <p class="err" *ngIf="error()">{{ error() }}</p>

    <ng-container *ngIf="posts$ | async as posts">
      <div *ngFor="let p of posts.slice(0, 10)" class="card">
        <h3>#{{ p.id }} — {{ p.title }}</h3>
        <p>{{ p.body }}</p>
      </div>
      <p *ngIf="!posts.length">No data available.</p>
    </ng-container>
  `,
  styles: [`
    .card { padding:1rem; border:1px solid #eee; border-radius:12px; margin:.5rem 0; }
    .err { color:#b00020; }
    button { margin:.5rem 0; }
  `]
})
export class ApiDataComponent implements OnInit {
  private api = inject(ApiService);

  posts$!: Observable<Post[]>;
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.posts$ = this.api.getPosts();
    this.posts$.subscribe({
      next: () => this.loading.set(false),
      error: (e) => { this.loading.set(false); this.error.set(e.message ?? 'Error'); }
    });
  }

  reload() { this.load(); }
}
