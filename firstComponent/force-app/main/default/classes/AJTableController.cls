public class AJTableController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountNames() {
        return [SELECT Id, Name FROM Account ORDER BY Name ASC];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactDetails(Id accountId) {
        return [SELECT Id, FirstName, LastName, Email, Phone, AJ_Asgn_Office_Country__c FROM Contact WHERE AccountId = :accountId];
    }
}