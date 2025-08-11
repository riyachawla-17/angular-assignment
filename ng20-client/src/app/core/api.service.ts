import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, retry, throwError } from 'rxjs';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`).pipe(
      retry(1),
      map(posts => posts.sort((a, b) => a.id - b.id)),
      catchError(this.handleError('getPosts'))
    );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`).pipe(
      retry(1),
      catchError(this.handleError('getPost'))
    );
  }

  private handleError(op: string) {
    return (err: any) => {
      console.error(`[ApiService] ${op} failed`, err);
      return throwError(() => new Error('Failed to load data. Please try again.'));
    };
  }
}
