import { Component } from '@angular/core';
import { Header } from './core/layout/header/header';
import { CreateMovie } from './features/movies/pages/create-movie/create-movie';
import { MovieDetails } from './features/movies/pages/movie-details/movie-details';
import { ExploreMovies } from './features/movies/pages/explore-movies/explore-movies';
import { FavoriteMovies } from './features/favorites/pages/favorite-movies/favorite-movies';
import { AuthenticationScreen } from './features/authentication/layout/authentication-screen/authentication-screen';

@Component({
  selector: 'app-root',
  imports: [Header, ExploreMovies, CreateMovie, FavoriteMovies, MovieDetails, AuthenticationScreen],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
