import { LightningElement, wire } from 'lwc';
import getAccountNames from '@salesforce/apex/AJContactTableController.getAccountNames';
import getContactDetails from '@salesforce/apex/AJContactTableController.getContactDetails';
import { NavigationMixin } from 'lightning/navigation';


/*The default export class is defined, which includes the NavigationMixin. This class sets up the state and 
methods needed to retrieve the Account and Contact data.*/
export default class AccountContactDetails extends NavigationMixin(LightningElement) {
  selectedAccountId = '';
  accountOptions = [];
  contacts = [];
  contact = null;

  
/*The handleEditClick method allows the user to navigate to the edit page of a Contact when clicking the "Edit"
button. This method uses the NavigationMixin to navigate to the standard__recordPage with the 
Contact's recordId and the 'edit' action.
*/

  handleEditClick(event) {
    const contactId = event.target.dataset.contactId;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: contactId,
        objectApiName: 'Contact',
        actionName: 'edit'
      }
    });
  }
/*The getAccountNames method is wired to the Apex method that retrieves the Account names. When the data is 
returned, it is mapped to accountOptions, which is used to populate the dropdown list.
*/

  @wire(getAccountNames)
  wiredAccountNames({ error, data }) {
    if (data) {
      this.accountOptions = data.map((acc) => ({
        label: acc.Name,
        value: acc.Id
      }));
    } else if (error) {
      console.error('Error fetching account names', error);
    }
  }

  /*The handleAccountChange method is called when the user selects a new Account. This sets the 
  selectedAccountId and calls getContactInfo to retrieve the Contacts related to the Account.
*/

  handleAccountChange(event) {
    this.selectedAccountId = event.detail.value;
    this.getContactInfo();
  }

/*The getContactDetails method is wired to the Apex method that retrieves the Contact details 
based on the selectedAccountId. When the data is returned, it is set to the contacts array.
*/


// getContactDetails() {
//   getContactDetails({ accountId: this.selectedAccountId })
//     .then((result) => {
//       this.contacts = result;
//     })
//     .catch((error) => {
//       console.error('Error fetching contact details', error);
//     });
// }

@wire(getContactDetails, { accountId: '$selectedAccountId' })
wiredContactDetails({ error, data }) {
  if (data) {
    this.contacts = data;
  } else if (error) {
    console.error('Error fetching contact details', error);
  }
}


/*The getContactInfo method retrieves the Contact details for the selected Account. 
 If there is an error, it is logged to the console.*/


  getContactInfo() {
    getContactDetails({ accountId: this.selectedAccountId })
      .then((result) => {
        this.contact = result[0];
      })
      .catch((error) => {
        console.error('Error fetching contact details', error);
      });
  }
}