import {Component} from "angular2/core";
import {Router} from "angular2/router";
//import {User} from './user';
import {AuthService} from "./auth.service";

@Component ({
    selector: 'my-logout',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <button class="btn btn-danger" (click)="onLogout()">Logout</button>

        </section>
    `

})
export class LogoutComponent {
    constructor(private _authService: AuthService, private _router: Router) {}
    onLogout() {
        this._authService.logout();
        this._router.navigate(['Signin']); // this will navigate to signin navigation tab.
    }

}