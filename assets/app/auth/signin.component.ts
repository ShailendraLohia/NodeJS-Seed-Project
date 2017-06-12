import {Component,OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {User} from './user';
import {AuthService} from "./auth.service";
import {FormBuilder,ControlGroup,Validators,Control} from "angular2/common"; // classes inside {} are form helper class.

@Component({
    selector: 'my-signin',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form [ngFormModel]="myForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="email">Mail</label>
                    <input [ngFormControl]="myForm.find('email')" type="email" id="email" class="form-control">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input [ngFormControl]="myForm.find('password')" type="password" id="password" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="!myForm.valid">Sign Up</button>
            </form>
        </section>
    `
})

export class SigninComponent implements OnInit{

    myForm: ControlGroup;
    constructor(private _fb: FormBuilder, private _authService: AuthService, private _router: Router) {}

    onSubmit() {
        console.log(this.myForm.value);
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this._authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.obj); // localStorage is javascript function and it will store token in browser.
                    localStorage.setItem('userId',data.userId);
                    this._router.navigateByUrl('/');
                },
                error => console.log(error)
            )
    }

    ngOnInit() {
        this.myForm = this._fb.group({
            email: ['',Validators.compose([
                Validators.required,
                this.isEmail
            ])],
            password: ['',Validators.required],
        });
    }

    private isEmail(control: Control): {[s: string]: boolean} {
        if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
            return {invalidMail: true};
        }
    }

}