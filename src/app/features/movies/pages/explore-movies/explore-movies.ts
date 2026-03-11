import { Component, inject, linkedSignal, signal } from '@angular/core';
import { MoviesList } from '../../../../shared/components/movies-list/movies-list';
import { MoviesFilter } from '../../components/movies-filter/movies-filter';
import { MoviesApi } from '../../services/movies-api';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-explore-movies',
  imports: [MoviesList, MoviesFilter],
  templateUrl: './explore-movies.html',
  styleUrl: './explore-movies.css',
})
export class ExploreMovies {
  private readonly _moviesApi = inject(MoviesApi);

  movieTitleFilter = signal('');
  movieCategoryFilter = signal('');

  moviesResource = rxResource({
    params: () => true,
    stream: () => this._moviesApi.getMovies(),
  });

  moviesFiltered = linkedSignal(() => {
    const ERROR_ON_RESPONSE = this.moviesResource.error();

    if (ERROR_ON_RESPONSE) return [];

    const moviesList = this.moviesResource.value() ?? [];

    const titleSearch = this.movieTitleFilter().toLowerCase().trim();
    const categorySearch = this.movieCategoryFilter().toLowerCase().trim();

    if (!titleSearch && !categorySearch) {
      return moviesList;
    }

    return moviesList.filter((movie) => {
      const matchesTitle = movie.titulo.toLocaleLowerCase().includes(titleSearch);
      const matchesCategory = movie.genero.toLocaleLowerCase().includes(categorySearch);

      return matchesTitle && matchesCategory;
    });
  });

  adicionarFilme() {}
}
