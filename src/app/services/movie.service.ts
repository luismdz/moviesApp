import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private tmdb_apikey = '83e428b157fb06b3ab0662c0328fc80f';
  private tmdb_link = 'https://api.themoviedb.org/3';
  private omdb_apikey = '186cc854';

  search = new Subject<any>();

  constructor(
    private http: HttpClient
  ) { }

  getMoviesByPopularity() {
    let url = `${this.tmdb_link}/movie/popular?api_key=${this.tmdb_apikey}&language=en-US`;

    return this.http.get(url).pipe(
      map(data => data['results']));
  }

  getTopRatedMovies() {
    let url = `${this.tmdb_link}/movie/top_rated?api_key=${this.tmdb_apikey}&language=en-US`;

    return this.http.get(url).pipe(
      map(data => data['results']));
  }

  getUpcomming() {
    let fechaDesde = new Date()
    let fechaHasta = new Date();
    fechaHasta.setDate(fechaDesde.getDate() + 7);

    let desde = `${fechaDesde.getFullYear()}-${('0' + (fechaDesde.getMonth() + 1)).slice(-2)}-${('0' + fechaDesde.getDate()).slice(-2)}`;

    let hasta = `${fechaHasta.getFullYear()}-${('0' + (fechaHasta.getMonth() + 1)).slice(-2)}-${('0' + fechaHasta.getDate()).slice(-2)}`;

    let url = `${this.tmdb_link}/discover/movie?api_key=${this.tmdb_apikey}&language=en-US&sort_by=popularity.desc&primary_release_date.gte=${desde}&primary_release_date.lte=${hasta}`;

    return this.http.get(url).pipe(
      map(data => data['results']));
  }

  getMovieDetails(id: string) {

    let url = `${this.tmdb_link}/movie/${id}?api_key=${this.tmdb_apikey}&language=en-US`;


    const tmdb_result = this.http.get(url);

    const omdb_result = tmdb_result.pipe(
      switchMap((data: any) => {

        return this.http.get(`http://www.omdbapi.com/?i=${data['imdb_id']}&plot=full&apikey=${this.omdb_apikey}`);
      })
    );

    const movie = forkJoin(
      tmdb_result,
      omdb_result
    );

    return movie;

  }

  searchMovies(qry: string) {
    let url = `${this.tmdb_link}/search/movie/?api_key=${this.tmdb_apikey}&query=${qry}`;

    this.http.get(url)
      .pipe(
        map(data => {
          console.log(data['results']);
          return data['results']
        })
      ).subscribe(movies => {
        movies['qry'] = qry;
        this.search.next(movies);
      }, error => {
        console.log(error.message);
        return this.search.next([]);
      })
  }

}
