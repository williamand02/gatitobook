import { switchMap, tap } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Comentarios } from './comentarios';
import { ComentariosService } from './comentarios.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  @Input() id!: number;

  comentarios$!: Observable<Comentarios>;
  comentarioForm!: FormGroup;

  constructor(
    private comentariosService: ComentariosService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.comentarios$ = this.comentariosService.buscaComentario(this.id);
    this.comentarioForm = this.formBuilder.group({
      comentario: ['', Validators.maxLength(300)],
    });
  }

  gravar() {
    const comentario = this.comentarioForm.get('comentario')?.value ?? '';
    this.comentarios$ = this.comentariosService
      .incluiComentario(this.id, comentario)
      .pipe(
        switchMap(() => this.comentariosService.buscaComentario(this.id)),
        tap(() => {
          this.comentarioForm.reset();
          // alert('Comentário gravado com sucesso!');
        })
      );
    this.comentarioForm.reset();
  }
}
