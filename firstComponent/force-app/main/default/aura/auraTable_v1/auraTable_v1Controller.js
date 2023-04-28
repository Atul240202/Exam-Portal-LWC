({
    doInit : function(component, event, helper) {
        helper.getAccounts(component);
    },
    
    handleAccountChange : function(component, event, helper) {
        var selectedAccountId = component.get("v.selectedAccountId");
        helper.getContacts(component, selectedAccountId);
    },
    
    
    editContact : function(component, event, helper) {
        var contactId = event.getSource().get('v.value');
        var editRecordEvent = $A.get('e.force:editRecord');
        editRecordEvent.setParams({
            'recordId': contactId
        });
        editRecordEvent.fire();
    }
})