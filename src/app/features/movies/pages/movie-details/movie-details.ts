import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  reviewsCount = 5;
  // Apenas uma array de 5 elementos para o @for loop
  stars = new Array(5);

  // Sinais para controle de estado
  isFavorite: WritableSignal<boolean> = signal(false);
  currentRating: WritableSignal<number> = signal(4); // Inicia com 4 estrelas preenchidas

  constructor() {}

  /**
   * Verifica se a estrela em um dado índice deve estar preenchida (roxa).
   * Substitui o [ngClass] no template.
   */
  isStarFilled(index: number): boolean {
    // O índice (base 0) deve ser menor que o rating (base 1) para ser preenchido
    return index < this.currentRating();
  }

  /**
   * Alterna o estado de favorito do filme.
   */
  toggleFavorite() {
    this.isFavorite.update((value) => !value);
    console.log(`Filme agora é favorito: ${this.isFavorite()}`);
  }

  /**
   * Define o rating do filme baseado no clique na estrela.
   */
  setRating(event: MouseEvent) {
    const target = event.target as SVGElement;

    // Encontra o elemento SVG que tem o data-rating
    const ratingElement = target.closest('svg');

    if (ratingElement) {
      const newRating = parseInt(ratingElement.getAttribute('data-rating') || '0', 10);

      // Lógica de toggle: se clicar na estrela atual, zera. Senão, define o novo rating.
      if (newRating === this.currentRating()) {
        this.currentRating.set(0);
      } else {
        this.currentRating.set(newRating);
      }

      console.log(`Nova avaliação definida: ${this.currentRating()}`);
      // Lógica de backend iria aqui
    }
  }
}
