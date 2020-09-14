import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  movies = {
    popular: [],
    top_rated: [],
    upcomming: [],
    searchedMovies: []
  }

  // slideConfig = { "slidesToShow": 4, "slidesToScroll": 4 };

  constructor(
    private ms: MovieService,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this.loadMovies();
  }

  ngOnInit(): void {

    this.ms.search.subscribe(movies => {
      this.movies.searchedMovies = movies;
    })

  }


  loadMovies() {
    this.ms.getMoviesByPopularity().subscribe(
      popularMovies => {
        this.movies.popular = popularMovies;
        // this.spinner.hide();
      }
    );

    this.ms.getTopRatedMovies().subscribe(
      topRatedMovies => {
        this.movies.top_rated = topRatedMovies;
        // this.spinner.hide();
      }
    );

    this.ms.getUpcomming().subscribe(
      topRatedMovies => {
        this.movies.upcomming = topRatedMovies;
        this.spinner.hide();
      }
    )
  }

}
