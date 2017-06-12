import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {User} from './user';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable() // these are called decorators in angular2.
export class AuthService {

    constructor(private _http: Http){}

    signup(user: User) {
        const body = JSON.stringify(user); // The JSON.stringify() method converts a JavaScript value to a JSON string,
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post('http://localhost:3000/user', body, { headers: headers })
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));

    }

    signin(user: User) {
        const body = JSON.stringify(user); // The JSON.stringify() method converts a JavaScript value to a JSON string,
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post('http://localhost:3000/user/signin', body, { headers: headers })
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }


    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

}