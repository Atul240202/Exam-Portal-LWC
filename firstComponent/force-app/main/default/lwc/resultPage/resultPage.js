import { LightningElement, wire } from 'lwc';
import getAnswers from '@salesforce/apex/ExamSetController.getAnswers';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
export default class ResultPortal extends NavigationMixin(LightningElement){
    
    userId;
    examId;
    currentPageReference

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
    }

    answer = [];
    score = 0;

    async connectedCallback() {
        this.examId = this.currentPageReference?.state?.c__examId;
        this.userId = Id;

        const result = await getAnswers({examId : this.examId, userId: this.userId});
        this.answer = result;
        console.log('examId: ' + this.examId);
        console.log('userId: ' + this.userId);
        console.log('result: ' + JSON.stringify(result));


        for(let i=0; i<this.answer.length; i++){
            console.log('Choosed_Option__c: ' + this.answer[i].Choosed_Option__c);
            console.log('Correct_Answer__c: ' + this.answer[i].Correct_Answer__c);
            if(this.answer[i].Choosed_Option__c === this.answer[i].Correct_Answer__c){
                this.score = this.score + 5;
            }
        }

        console.log('Score of test is: '+ this.score);
    }

    handleClick(event){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'AJ_Register_for_Exam__c'
            }
        });
    }
}