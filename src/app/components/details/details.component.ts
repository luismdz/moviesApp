import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  movie: any = {};

  constructor(
    private ms: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {

    this.spinner.show();

    this.route.params.subscribe(params => {

      this.ms.getMovieDetails(params.id).subscribe(
        data => {

          this.movie = {
            ...data[0],
            ...data[1]
          }

          this.movie = {
            imdbRating: this.movie.imdbRating === 'N/A' ? 0 : this.movie.imdbRating,
            ratings: this.movie.Ratings,
            Year: new Date(this.movie.release_date).getFullYear().toString(),
            Plot: this.movie.Plot == null ? this.movie.overview : this.movie.Plot,
            ...this.movie
          }

          console.log(this.movie);
          console.log(new Date(this.movie.release_date).getFullYear());
          this.spinner.hide();
        }
      )

    });

  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigateByUrl('/home');
    this.ms.search.next('');
  }

}
