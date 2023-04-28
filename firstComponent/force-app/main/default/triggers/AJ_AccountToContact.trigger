trigger AJ_AccountToContact on Account (after update) {
    if(trigger.isAfter){
        if(trigger.isUpdate){
            AccountContactHandler.updateContact(trigger.new,trigger.oldMap);
        }
    }
}