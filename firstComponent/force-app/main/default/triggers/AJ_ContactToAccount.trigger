trigger AJ_ContactToAccount on Contact (before insert) {
    if(trigger.isBefore){
        AccountContactHandler.updateOfficeCountry(trigger.new);
    }
}