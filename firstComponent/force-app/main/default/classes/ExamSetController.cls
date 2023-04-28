public with sharing class ExamSetController {

    @AuraEnabled
    public static List<Exam_Question__c> getQuestions(String examId){
        List<Exam_Question__c> ql= [SELECT Id,Type_the_Description__c,Name,Option_A__c,Option_B__c,Option_C__c,Option_D__c,Answer__c from Exam_Question__c where Exam_Set__r.Id = :examId];
        
        for(Exam_Question__c q:ql){
            system.debug(q);
        }
        
        return ql;
    }
    
    @AuraEnabled
    public static List<Exam_Set__c> fetchExamType() {
        return [SELECT Id, Name, Subject__c, Available_Start_Date__c, Available_End_Date__c FROM Exam_Set__c];
    }
    
    @AuraEnabled
    public static void setStudent(Exam_Registration__c stu, String userId) {
        if(stu.Exam_Name__c == '' || stu.Select_Date__c == null){
            throw new AuraHandledException('Fields cannot be empty');
        }
        
        List<Exam_Registration__c> exRegs = [Select Id,Name,Email_Id__c,Exam_Name__c,Exam_Id__c,IsSubmitted__c,State__c,Select_Date__c from Exam_Registration__c where CreatedById = :userId];
        for(Exam_Registration__c ex: exRegs){
            if(ex.Exam_Id__c == stu.Exam_Id__c){
                throw new AuraHandledException('You have already given this exam');
            }
        }
        
        List<Exam_Set__c> exams = [SELECT Id, Name, Available_Start_Date__c, Available_End_Date__c FROM Exam_Set__c where Name = :stu.Exam_Name__c];
        for(Exam_Set__c ex: exams){
            if(ex.Available_Start_Date__c>stu.Select_Date__c || ex.Available_End_Date__c<stu.Select_Date__c){
                throw new AuraHandledException('Please select a date between the available start and end date of the exam');
            }
        }
        insert stu;
    }
    
    @AuraEnabled
    public static List<Exam_Registration__c> getRegisteredExams(String userId){
        List<Exam_Registration__c> resList = [Select Id,Name,Email_Id__c,Exam_Name__c,Exam_Id__c,IsSubmitted__c,State__c,Select_Date__c from Exam_Registration__c where CreatedById = :userId];
        for(Exam_Registration__c res: resList){
            system.debug(res);
        }
        return resList;
    }
    
    @AuraEnabled
    public static void setAnswers(List<Exam_Score__c> ans){
        insert ans;
    }
    
    @AuraEnabled
    public static List<Exam_Score__c> getAnswers(String examId, String userId){
        List<Exam_Score__c> al = [SELECT Id, Question_Description__c, Choosed_Option__c, Correct_Answer__c FROM Exam_Score__c where ExamID__c = :examId and CreatedById= :userId ORDER BY Name ASC];
        for(Exam_Score__c a:al){
            system.debug(a);
        }
        
        return al;
    }
    
    @AuraEnabled
    public static void updateExamState(String examId, String userId){
        List<Exam_Registration__c> resList = [Select Id,Name,Email_Id__c,Exam_Name__c,Exam_Id__c,IsSubmitted__c,State__c,Select_Date__c from Exam_Registration__c where CreatedById = :userId and Exam_Id__c = :examId];
        
        for(Exam_Registration__c res: resList){
            res.State__c = 'Attempted';
            res.IsSubmitted__c = 1;
        }
        
        update resList;
    }
}
