import {Component, OnInit} from 'angular2/core';
import {Message} from './message';
import {MessageService} from "./message.service";

@Component({

    selector: 'my-message-input',
    template: `
        <section class="col-md-8 col-md-offset-2">
            <form (ngSubmit)="onSubmit(f.value)" #f="ngForm">  <!-- #f is variable which will be visible in template and used as f.value -->
                <div class="form-group">
                    <label for="content">Content</label>
                    <input ngControl="content" type="text" class="form-control" id="content" 
                        #input [ngModel]="message?.content"> <!-- #input is variable which will be visible in template  and '?' tells whether message is null or not-->
                </div>
                <button type="submit" class="btn btn-primary">{{ !message ? 'Send Message' : 'Save Message'}}</button>
                <button type="button" class="btn btn-danger" (click)="onCancel" *ngIf="message">Cancel</button>
            </form>
            
        </section>
    `
    //providers: [MessageService]    
    //providers are used to inject dependencies. 
    // if providers are used in particular component then instance will be created for that particular instance.
    // Here "MessageService" instance should be common between all message components. Hence it moved to boot.ts. Please check there.
    // <!--(click)="onCreate(input.value)" -->
})

export class MessageInputComponent implements OnInit {

    message: Message = null;
    constructor(private _messageService: MessageService) { }

    onCreate(content: string) {
        const message: Message = new Message(content, null, 'Dummy');
        this._messageService.addMessage(message);

    }// onCreate() is not in use.

    onSubmit(form: any) {

        if (this.message) {
            // Edit
            this.message.content = form.content;
            this._messageService.updateMessage(this.message)
                .subscribe(
                data => console.log(data),
                error => console.log(error)
                );
            this.message = null;
        }
        else {
            const message: Message = new Message(form.content, null, 'Dummy');
            this._messageService.addMessage(message) // here addMessage function act as Observable
                .subscribe( // subscribe method subscribe on Observable which means subscribe listen in any data which is coming through Observable. 
                data => {
                    console.log(data);
                    console.log("inside message-input-component : onsubmit function");
                    this._messageService.messages.push(data)
                },
                error => console.log(error)
                );
        }

    }

    onCancel() {
        this.message = null;
    }

    ngOnInit() {// called right after constructor.
        this._messageService.messageIsEdit.subscribe(
            message => {
                this.message = message;
            }

        )
    }

}