import { LightningElement, track, wire, api } from 'lwc'; 
import searchDoctors from '@salesforce/apex/DoctorController.searchDoctors'; 

export default class AppointmentBookingForm extends LightningElement {
    @track searchDoctorName; // Search Doctor Name input field
    @track searchSpecialty; 
    @track contacts = []; 
    @track error; 
    
    // Update searchDoctorName property when user types in the Doctor Name input field
    handleDoctorNameChange(event) {
        this.searchDoctorName = event.target.value;
    }
    
    handleSpecialtyChange(event) {
        this.searchSpecialty = event.target.value;
    }
    
    handleResetClick() {
        this.searchDoctorName = '';
        this.searchSpecialty = '';
        this.contacts = null;
    }
    
    // Call searchDoctors Apex method with searchDoctorName and searchSpecialty parameters and display the results
    handleSearchClick() {
        searchDoctors({
            searchDoctorName: this.searchDoctorName,
            searchSpecialty: this.searchSpecialty
        })
        .then(result => {
            this.contacts = result; // Assign the result to the contacts property
            console.log(result); 
            console.log("I am clicked"); 
        })
        .catch(error => {
            this.error = error;
        });
    }
}
