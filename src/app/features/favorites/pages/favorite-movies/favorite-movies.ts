import { Component } from '@angular/core';
import { MoviesList } from '../../../../shared/components/movies-list/movies-list';

@Component({
  selector: 'app-favorite-movies',
  imports: [MoviesList],
  templateUrl: './favorite-movies.html',
  styleUrl: './favorite-movies.css',
})
export class FavoriteMovies {}
