public class accountContactFetch {
    public static void fetchContact(){
        List<Account> accList = new List<Account>();
        for(Account acc:accList)
        {
            System.debug('acclist' +acc);
            for(Contact con :acc.Contacts){
                System.debug('Contact Records--->'+con);
            }
        }
        
    }
}