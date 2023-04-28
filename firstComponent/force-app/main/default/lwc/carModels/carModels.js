import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import CAR_MODEL_OBJECT from '@salesforce/schema/Car_Model__c';
import CAR_MODEL_NAME_FIELD from '@salesforce/schema/Car_Model__c.Name';

const FIELDS = [ CAR_MODEL_NAME_FIELD, 'On_Road_Price__c', 'Color__c', 'Car_Specs__c'];


export default class CarModels extends LightningElement {
    carModels;
    @wire(getListUi, {
        objectApiName: CAR_MODEL_OBJECT,
        listViewApiName: 'All',
        fields: FIELDS
    })
    wiredCarModelsCustomFields({ error, data }) {
        if (data) {
            this.carModels = data.records.records;
        } else if (error) {
            console.error(error);
        }
    }
}