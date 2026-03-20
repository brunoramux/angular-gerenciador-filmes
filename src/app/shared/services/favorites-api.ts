import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MoviesListResponse } from '../types/movies-list-response';
import { IMovieToFavoriteSuccessResponse } from '../models/movie-to-favorite-success-response';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApi {
  private readonly _httpClient = inject(HttpClient);

  getFavorites() {
    return this._httpClient.get<MoviesListResponse>('http://localhost:3000/favorites');
  }

  addMovieToFavorites(id: number) {
    return this._httpClient.post<IMovieToFavoriteSuccessResponse>(
      'http://localhost:3000/favorites/' + id,
      {},
    );
  }

  removeMovieFromFavorites(id: number) {
    return this._httpClient.delete<void>('http://localhost:3000/favorites/' + id);
  }
}
