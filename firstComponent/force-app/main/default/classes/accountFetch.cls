public class accountFetch {
    public static void fetchData(){
     List<List<sObject>> lstOfData = [FIND 'United' IN ALL FIELDS Returning Account(Name),
                                     contact(FirstName, LastName, phone), lead, opportunity(Name)];
        system.debug('lstOfData@@--->' +lstOfData);
        
        List<Account> acclast = lstOfData[0];
        for (Account acc:acclast){
            System.debug('All United Account'+acc);
        }
        
    	List<Contact> conlst = lstOfData[1];
    	for (Contact con : conlst) {
        	System.debug('All United contact' + con);
    	}

    }
}