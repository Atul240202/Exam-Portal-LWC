import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import getRegisteredExams from '@salesforce/apex/ExamSetController.getRegisteredExams';
import updateExamState from '@salesforce/apex/ExamSetController.updateExamState';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ExamPortalRegisteredExams extends NavigationMixin(LightningElement) {
    userId = Id; 
    exams=[];
 
   async connectedCallback() {
    //    this.userId = Id;
       console.log('I am user id: ' + this.userId); 

       const result = await getRegisteredExams({userId : this.userId});
       this.exams = result;
       console.log('I am exam: ' + this.exams);
   }

   async handleClick(event) {
       if(event.target.label !== 'Attempted'){
            const regId = event.target.title;
            for(let i=0;i<this.exams.length;i++){
                if(regId === this.exams[i].Id){
                    this.examId = this.exams[i].Exam_Id__c;
                }
            }
            try{
                await updateExamState({examId: this.examId, userId: this.userId});
            }
            catch(err){
                console.log(err);
            }

            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Questions__c'
                },
                state: {
                    c__examId: this.examId
                }
            });
       }
       else{
            const toastEvent = new ShowToastEvent({
                title: 'Alert!',
                message: 'You have already attempted this exam!!',
                variant: 'info'
            });
            this.dispatchEvent(toastEvent);
       }
   }

   async handleResult(){

       const regId = event.target.title;
            for(let i=0;i<this.exams.length;i++){
                if(regId === this.exams[i].Id){
                    this.examId = this.exams[i].Exam_Id__c;
                }
        }

       this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Results__c'
                },
                state: {
                    c__examId: this.examId
                }
        });
   }
}
