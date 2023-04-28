import { LightningElement,wire } from 'lwc';
import getExamType from '@salesforce/apex/ExamSetController.fetchExamType';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserEmail from '@salesforce/schema/User.Username';
import setStudent from '@salesforce/apex/ExamSetController.setStudent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ExamRegisterPage extends NavigationMixin(LightningElement) {
    userId = Id;
    examtypelst;
    mail;
    selectedExam;
    selectedDate;
    selectedExamId;
    userEmail;

    @wire(getRecord, { recordId: Id, fields: [UserEmail]}) 
    currentUserInfo({error, data}) {
        if (data) {
            this.userEmail = data.fields.Username.value;
            console.log('UserEmail: '+ this.userEmail);
        } else if (error) {
            this.error = error ;
        }
    }

    // Fetching Exam Type by calling Apex
    async connectedCallback() {
        try {
            const res = await getExamType();
            this.examtypelst = res;
        } catch (err) {
            alert('Error');
        }
    }

    onChangeMail(event){
        this.mail = event.target.value;
    }

    // Holding Selected Exam
    onChangeSelExam(event) {
        this.selectedExam = event.target.value;
        for(let i=0;i<this.examtypelst.length;i++){
            if(this.selectedExam === this.examtypelst[i].Name){
                this.selectedExamId = this.examtypelst[i].Id;
            }
        }
    }

    onChangeExamDate(event) {
        this.selectedDate = event.target.value;
    }

    async saveStudent() {
        let studentdata = {'sobject':'Exam_Registration__c'};
        studentdata.Email_Id__c = this.userEmail;
        studentdata.Exam_Name__c = this.selectedExam;
        studentdata.Select_Date__c = this.selectedDate;
        studentdata.Exam_Id__c = this.selectedExamId;
        studentdata.State__c = 'Start';
        studentdata.IsSubmitted__c = 0;
        try {
            await setStudent({stu:studentdata, userId: this.userId});
            console.log("Data:" + studentdata.Email_Id__c);
            const toastEvent = new ShowToastEvent({
                title: 'Success!',
                message: 'Added Successfully',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'startPage__c'
                }
            });
        } catch (err) {
            const toastEvent = new ShowToastEvent({
                title: 'Error!',
                message: err.body.message,
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
            console.error(err);
        }
    }
}
