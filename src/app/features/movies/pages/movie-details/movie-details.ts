import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MoviesApi } from '../../services/movies-api';
import { DecimalPipe } from '@angular/common';
import { tap } from 'rxjs';
import { FavoritesApi } from '../../../../shared/services/favorites-api';

@Component({
  selector: 'app-movie-details',
  imports: [DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  private readonly _moviesApi = inject(MoviesApi);
  private readonly _favoritesApi = inject(FavoritesApi);
  BASE_PATH = 'http://localhost:3000';

  id = input.required<string>();
  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._moviesApi.getMovieDetails(+params),
  });

  favoritesResource = rxResource({
    params: () => true,
    stream: () =>
      this._favoritesApi.getFavorites().pipe(
        tap((favorite) => {
          favorite.forEach((favorite) => {
            if (favorite.id === +this.id()) {
              this.toggleFavorite();
            }
          });
        }),
      ),
  });

  isFavorite = signal(false);
  toggleFavorite() {
    this.isFavorite.update((value) => !value);
    if (this.isFavorite()) {
      this._favoritesApi.addMovieToFavorites(+this.id()).subscribe();
      console.log('Oi');
    } else {
      this._favoritesApi.removeMovieFromFavorites(+this.id()).subscribe();
    }
  }

  movieDetails = linkedSignal(() => {
    const ERROR_ON_RESPONSE = !!this.movieDetailsResource.error();

    if (ERROR_ON_RESPONSE) return undefined;

    return this.movieDetailsResource.value();
  });

  currentRating = signal<number | undefined>(undefined);
  starsStatusFilled = computed(() => {
    const rating = this.currentRating() ?? 0;

    const boolArray = [0, 1, 2, 3, 4].map((index) => {
      return index < rating;
    });

    return boolArray;
  });

  rateMovieResource = rxResource({
    params: () => {
      const rating = this.currentRating() ?? 0;
      if (rating > 0) {
        return {
          id: Number(this.id()),
          rating,
        };
      }

      return undefined;
    },
    stream: ({ params }) =>
      this._moviesApi.rateMovie(params.id, params.rating).pipe(
        tap((updatedMovie) => {
          this.movieDetails.set(updatedMovie);
        }),
      ),
  });

  updateRating(newRating: number) {
    if (newRating + 1 === this.currentRating()) {
      this.currentRating.set(0);
    } else {
      this.currentRating.set(newRating + 1);
    }
  }
}
