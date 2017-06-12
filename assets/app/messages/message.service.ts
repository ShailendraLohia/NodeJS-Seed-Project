import {Message} from './message';
import {Http, Headers} from "angular2/http";
import {Injectable, EventEmitter} from "angular2/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";


@Injectable()
export class MessageService {

    messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private _http: Http) { }

    addMessage(message: Message) {
        const body = JSON.stringify(message); // The JSON.stringify() method converts a JavaScript value to a JSON string,
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.post('http://localhost:3000/message' + token, body, { headers: headers })
            .map(response => { // map will return Observable.
                console.log("inside addMessage function");
                const data = response.json().obj;
                let message = new Message(data.content, data._id, data.user.firstName, data.user._id);
                return message;
            })
            .catch(error => Observable.throw(error.json()));
    }

    getMessages() {
        //return this.messages;
        return this._http.get('http://localhost:3000/message')
            .map(response => {
                const data = response.json().obj;
                let objs: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    let message = new Message(data[i].content, data[i]._id, data[i].user.firstName, data[i].user._id);
                    objs.push(message);
                };
                return objs;

            })
            .catch(error => Observable.throw(error.json()));
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message); // The JSON.stringify() method converts a JavaScript value to a JSON string,
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        this.messages[this.messages.indexOf(message)] = new Message('Edited', null, 'Dummy Edited');
        return this._http.patch('http://localhost:3000/message/' + message.messageId + token, body, { headers: headers })
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }



    editMessage(message: Message) { // this method is being called from message.component.ts
        this.messageIsEdit.emit(message);
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.delete('http://localhost:3000/message/' + message.messageId + token)
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }
}




// Observable are similar to promise but main differnece are Observables can handle many request but promise can handle only one 
//and Observables are cancellable but promise are not.
// 