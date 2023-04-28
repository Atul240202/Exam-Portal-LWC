import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserName from '@salesforce/schema/User.Name';
export default class ExamPortalHome extends LightningElement {

    userId = Id;
    userName;

    @wire(getRecord, { recordId: Id, fields: [UserName]}) 
    currentUserInfo({error, data}) {
        if (data) {
            this.userName = data.fields.Name.value;
        } else if (error) {
            this.error = error ;
        }
    }

}