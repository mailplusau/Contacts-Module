
/*
 * Author:               Ankith Ravindran
 * Created on:           Tue Jun 06 2023
 * Modified on:          Tue Jun 06 2023 08:16:07
 * SuiteScript Version:  1.0 
 * Description:          Check if email has activated portal account or not.  
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function checkAccountActivated() {

    //Customer Contacts - Mail/Parcel Operator Role - Password Email Sent
    var contactCreatePasswordEmailSentSearch = nlapiLoadSearch('customer', 'customsearch_cust_contact_mail_parcel__2');
    var contactCreatePasswordResultSet = contactCreatePasswordEmailSentSearch.runSearch();
    contactCreatePasswordResultSet.forEachResult(function (contactCreatePasswordEmailSentSearchResultSet) {

        customerInternalId = contactCreatePasswordEmailSentSearchResultSet.getValue('internalid');
        contactInternalId = contactCreatePasswordEmailSentSearchResultSet.getValue("internalid", "contact", null);
        contactFName = contactCreatePasswordEmailSentSearchResultSet.getValue("firstname", "contact", null);
        contactLName = contactCreatePasswordEmailSentSearchResultSet.getValue("lastname", "contact", null);
        contactEmail = contactCreatePasswordEmailSentSearchResultSet.getValue("email", "contact", null);
        contactPhone = contactCreatePasswordEmailSentSearchResultSet.getValue("phone", "contact", null);
        
        nlapiLogExecution('DEBUG', 'contactEmail', contactEmail);

        var headers = {};
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
        headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';
        var mainURL = 'https://mpns.protechly.com/outbound_emails?email=' + contactEmail;
        var response = nlapiRequestURL(mainURL, null, headers);

        var body = response.body;

        nlapiLogExecution('DEBUG', 'body', body);

        if (isNullorEmpty(body)) {

        } else {
            var emailSubjects = JSON.parse(body);
            nlapiLogExecution('DEBUG', 'emailSubjects', emailSubjects);
            var emailSubjectsLength = emailSubjects.length;
            nlapiLogExecution('DEBUG', 'emailSubjectsLength', emailSubjectsLength);

            var accountActivated = false;
            var createPasswordEmailCount = 0;

            for (var x = 0; x < emailSubjectsLength; x++) {
                if (emailSubjects[x].subject == 'Welcome to your MailPlus Shipping Portal.') {
                    accountActivated = true;
                } else if (emailSubjects[x].subject == 'Your MailPlus shipping portal is now ready for you to set up.') {
                    createPasswordEmailCount++;
                }
            }

            if (accountActivated == true) {
                var recContact = nlapiLoadRecord('contact', contactInternalId);
                recContact.setFieldValue('custentity_password_setup_completed', 1);
                recContact.setFieldValue('custentity_create_password_email', 1);
                recContact.setFieldValue('custentity_create_password_email_count', createPasswordEmailCount);
                nlapiSubmitRecord(recContact);
            }

            if (createPasswordEmailCount > 0) {
                var recContact = nlapiLoadRecord('contact', contactInternalId);
                recContact.setFieldValue('custentity_create_password_email', 1);
                recContact.setFieldValue('custentity_create_password_email_count', createPasswordEmailCount);
                nlapiSubmitRecord(recContact);
            }

        }

        return true;
    });

}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);

    return date;
}
