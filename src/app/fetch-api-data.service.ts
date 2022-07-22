import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

let apiUrl = 'https://myflixcf.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { }

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails
   * @returns a new user object
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * calls API to log in existing user
   * @params userDetails
   * @returns user data
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * calls API to get all movies
   * @returns array of all movies
   */
  getAllMovies(): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
  }

  /**
   * calls API to get single movie by title
   * @param title
   * @returns movie data object
   */
  getSingleMovie(title: any): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API to get info on a director
   * @param name
   * @returns director data object
   */
  getDirector(name: any): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/director/${name}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API for info on a genre
   * @param name
   * @returns genre data object
   */
  getGenre(name: any): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/genre/${name}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API for data on a single user
   * @returns user data object
   */
  getUser(): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    //gets username
    const username = localStorage.getItem('user');
    return this.http.get(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API for list of favorite movies for user
   * @returns list of user's favorite movies
   */
  getFavoriteMovies(): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    //gets username
    const username = localStorage.getItem('user');
    return this.http.get(apiUrl + `users/${username}/movies`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API to add a movie to user's favorites
   * @param movieID
   * @returns updated user data object
   */
  addFavoriteMovie(movieID: string): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    //gets username
    const username = localStorage.getItem('user');
    return this.http.post(apiUrl + `users/${username}/movies/${movieID}`, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API to delete a movie from user's favorites
   * @param movieID
   * @returns updated user data object
   */
  removeFavoriteMovie(movieID: any): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    //gets username
    const username = localStorage.getItem('user');
    return this.http.delete(apiUrl + `users/${username}/favoritemovies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API for user to update their information
   * @params updateDetails
   * @returns updated user data object
   */
  editUser(updateDetails: any): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    //gets username
    const username = localStorage.getItem('user');
    return this.http.put(apiUrl + `users/${username}`, updateDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * calls API to delete a user
   * @returns message on successful profile deletion
   */
  deleteUser(): Observable<any> {
    //gets auth token
    const token = localStorage.getItem('token');
    //gets username
    const username = localStorage.getItem('user');
    return this.http.delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**
   * extracts response data from HTTP response
   * @param res 
   * @returns response body or empty object 
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * error handler
   * @param error 
   * @returns error message
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}