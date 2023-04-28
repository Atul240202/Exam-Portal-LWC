public class AJ_LeadRecordforPatients {
    @AuraEnabled(cacheable=true)
    public static List<Lead> searchLeads(String searchTerm) {
        String searchQuery = searchTerm + '%';
        List<Lead> leads = [SELECT Id, FirstName, LastName, Company, Phone, Email
                            FROM Lead
                            WHERE (FirstName LIKE :searchQuery OR LastName LIKE :searchQuery)
                                  AND (CreatedById = '0052w00000GF5ZKAA1')];
        return leads;
    }
}