import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getQuestions from '@salesforce/apex/ExamSetController.getQuestions';
import setAnswers from '@salesforce/apex/ExamSetController.setAnswers';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
export default class ExamPortal extends NavigationMixin(LightningElement){

    examId;
    currentPageReference

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
    }

    questions = [];
    examResponses = [];
    options = new Map();
    isSubmit = false;

    async connectedCallback() {
        this.examId = this.currentPageReference?.state?.c__examId;
        console.log("Question -> " + this.examId); 
        const result = await getQuestions({examId: this.examId});
        console.log(result);
        this.questions=result;
            
    }

    handleChange(event){
        const questionId = event.target.name;
        const choiceSelected = event.target.value;

        this.options.set(questionId,choiceSelected);
        console.log(questionId,choiceSelected);
    }

    async handleSubmit(){
        console.log("submit clicked");
        console.log(this.options.size);

        for(let i=0;i<this.questions.length;i++){
            const response = {
                QuestionId: this.questions[i].Id,
                CorrectAns: this.questions[i].Answer__c,
                ChoosedOption: this.options.get(this.questions[i].Id),
                QuestionDescription: this.questions[i].Type_the_Description__c,
                ExamId: this.questions[i].Exam_Set__c
            };
            let examResponseData = {'sobject':'Exam_Score__c'};
            examResponseData.Choosed_Option__c = response.ChoosedOption;
            examResponseData.Correct_Answer__c = response.CorrectAns;
            examResponseData.Question_Id__c = response.QuestionId;
            examResponseData.Question_Description__c = response.QuestionDescription;
            examResponseData.ExamID__c = response.ExamId;

            this.examResponses.push(examResponseData);
        }

        console.log(JSON.parse(JSON.stringify(this.examResponses)));
        
        try{
            await setAnswers({ans: this.examResponses});
            const toastEvent = new ShowToastEvent({
                title: 'Success!',
                message: 'Successfully Submit',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
        }
        catch(err){
            const toastEvent = new ShowToastEvent({
                title: 'Error!',
                message: 'Failed to Submit. Try Again!!',
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
        }

        this.isSubmit = true;
    }

    handleResult(){
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
