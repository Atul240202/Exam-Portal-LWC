public with sharing class DoctorController {

    @AuraEnabled(Cacheable = true)
    public static list<Contact> searchDoctors(String searchDoctorName, string searchSpecialty) {
        searchDoctorName = '%' + searchDoctorName + '%';
        searchSpecialty = '%' + searchSpecialty + '%';  
        list<Contact> accLst = [SELECT Id, Name, AJ_Pin_Code__c, AJ_Years_of_Experience__c, AJ_Speciality__c 
                               FROM Contact 
                               WHERE (Name LIKE :searchDoctorName OR AJ_Speciality__c LIKE :searchSpecialty ) AND RecordType.Name = 'AJ Doctor'];
        
        if(accLst.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        
        return accLst;
    }  
}