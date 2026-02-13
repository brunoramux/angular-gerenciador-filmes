import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-create-movie',
  imports: [],
  templateUrl: './create-movie.html',
  styleUrl: './create-movie.css',
})
export class CreateMovie {
  // Sinal para armazenar o URL da pré-visualização da imagem
  imagePreview: WritableSignal<string | null> = signal(null);

  /**
   * Manipula a seleção de arquivo pelo input.
   * Abre o explorador de arquivos novamente se a imagem for clicada.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    // Certifica-se de que um arquivo foi selecionado
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Verifica se o arquivo é uma imagem
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        // Quando o arquivo é lido, armazena o resultado (base64) no sinal
        reader.onload = (e) => {
          this.imagePreview.set(e.target?.result as string);
        };

        // Lê o arquivo como URL de dados (Base64)
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecione um arquivo de imagem.');
        // Opcional: Limpa o input se o arquivo não for uma imagem
        input.value = '';
        this.imagePreview.set(null);
      }
    }
  }

  // Opcional: Adicione métodos para Salvar e Cancelar
  salvar() {
    console.log('Filme salvo!');
    // Implemente a lógica de envio do formulário aqui
  }

  cancelar() {
    console.log('Operação cancelada!');
    // Implemente a lógica de navegação de volta ou fechamento de modal aqui
  }
}
