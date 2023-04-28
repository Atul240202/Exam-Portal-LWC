public with sharing class HospitalController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchHospitals() {
        return [SELECT Name FROM Account WHERE RecordType.Name in ('AJ_Hospital')];
    }
    @AuraEnabled
    public static Lead createLead(Lead hs){
        insert hs;
        return hs;
    }
}