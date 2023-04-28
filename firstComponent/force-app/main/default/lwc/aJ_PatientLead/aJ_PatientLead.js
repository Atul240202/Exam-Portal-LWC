import { LightningElement, wire, track } from 'lwc';
import searchLeads from '@salesforce/apex/AJ_LeadRecordforPatients.searchLeads';
 
export default class aJ_PatientLead extends LightningElement {
    @track searchTerm = '';
    @track leads = {};
 
    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
    }
 
    @wire(searchLeads, { searchTerm: '$searchTerm' })
    wiredLeads(result) {
        this.leads = result;
    }
}