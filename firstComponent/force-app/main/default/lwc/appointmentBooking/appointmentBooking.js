import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import searchHospitals from '@salesforce/apex/HospitalController.searchHospitals';
import createLead from '@salesforce/apex/HospitalController.createLead';


/*This is the main class in the module that extends the LightningElement base class.
 It initializes an empty array called hospitalOptions.*/
export default class PatientRegistrationForm extends LightningElement {
    hospitalOptions = [];


/*The @wire decorator in LWC provides declarative data binding between a property and a wire adapter that 
retrieves the data. In this case, the searchHospitals Apex method is wired to the wiredHospitals function, 
which receives the data and/or error and sets the hospitalOptions array accordingly.*/
    @wire(searchHospitals)
    wiredHospitals({ data, error }) {
        if (data) {
            this.hospitalOptions = data;
            console.log("acc", data);
            this.error = undefined;

        } else if (error) {
            console.error(error);
            console.log('Error retrieving hospitals!');
            this.hospitalOptions = [];
        }
    }
//rec is an object that holds the patient's information as entered in the form.

    rec = {
        FirstName: '',
        LastName: '',
        Company: '',
        Email: '',
        Phone: '',
        PostalCode: ''
    }
/* These are event handlers for changes made to the patient's information in the form. 
Each handler updates the rec object with the new value entered in the form.*/

    handleHospitalChange(event) {
        this.rec.Company = event.target.value;
        console.log("Company", this.rec.Company);
    }

    handleFirstNameChange(event) {
        this.rec.FirstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.rec.LastName = event.target.value;
    }

    handleEmailChange(event) {
        this.rec.Email = event.target.value;
    }

    handlePhoneChange(event) {
        this.rec.Phone = event.target.value;
    }

    handlePostalCodeChange(event) {
        this.rec.PostalCode = event.target.value;
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.value = '';
            });
        }
        this.selectedAccount = '';
    }

/*If the required fields are not empty, it calls the createLead Apex method, passing in the rec property as 
an argument. If the method call is successful, it resets the form and displays a success message. 
If an error occurs, it displays an error message using the ShowToastEvent class.*/
    handleSubmit() {
        if (!this.rec.LastName || !this.rec.Company) {
            // display an error message if the required fields are empty
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please enter a Last Name and select a Hospital',
                    variant: 'error'
                })
            );
            return;
        }
        createLead({ hs: this.rec })
            .then(result => {
                this.message = result;
                this.error = undefined;
                if (this.message != undefined) {
                    this.Status = 'Open - Not Contacted';
                    console.log('Done');
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Lead created',
                            variant: 'success'
                        })
                    );
                    this.handleReset();
                }
                console.log('Successful');
                console.log(JSON.stringify(result));
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
                console.error("Error", JSON.stringify(this.error));
            });
    }
}
