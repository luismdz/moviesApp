import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  input: string;

  constructor(
    private ms: MovieService
  ) {
    this.ms.search.subscribe(text => this.input = text.qry);
  }

  ngOnInit(): void {
  }

  searchMovies() {
    if (this.input !== '') {
      this.ms.searchMovies(this.input);
    } else {
      this.ms.search.next('');
    }
  }
}
