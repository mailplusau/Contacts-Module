/*
 * Author:               Ankith Ravindran
 * Created on:           Tue Jun 13 2023
 * Modified on:          Tue Jun 13 2023 07:52:54
 * SuiteScript Version:  1.0 
 * Description:          Send out escalation email after the reminder email has been sent 4 times. 
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function sendEscalationEmail() {

    //Get the params passed to scheduled script to send out create password email
    // var customerInternalId = ctx.getSetting('SCRIPT', 'custscript_cust_internal_id');
    // var contactInternalId = ctx.getSetting('SCRIPT', 'custscript_contact_internal_id');
    // var contactFName = ctx.getSetting('SCRIPT', 'custscript_contact_fname');
    // var contactLName = ctx.getSetting('SCRIPT', 'custscript_conatct_lname');
    // var contactEmail = ctx.getSetting('SCRIPT', 'custscript_contact_email');
    // var contactPhone = ctx.getSetting('SCRIPT', 'custscript_contact_phone');

    // nlapiLogExecution("DEBUG", "customerInternalId", customerInternalId);
    // nlapiLogExecution("DEBUG", "contactFName", contactFName);
    // nlapiLogExecution("DEBUG", "contactLName", contactLName);
    // nlapiLogExecution("DEBUG", "contactEmail", contactEmail);
    // nlapiLogExecution("DEBUG", "contactPhone", contactPhone);

    prev_inv_deploy = ctx.getDeploymentId();

    // if (isNullorEmpty(customerInternalId)) {
    var contactEscalationEmailSearch = nlapiLoadSearch('customer', 'customsearch_cust_contact_mail_parcel__3');
    var contactEscalationEmailResultSet = contactEscalationEmailSearch.runSearch();
    contactEscalationEmailResultSet.forEachResult(function (contactEscalationEmailSearchResultSet) {

        customerInternalId = contactEscalationEmailSearchResultSet.getValue('internalid');
        contactInternalId = contactEscalationEmailSearchResultSet.getValue("internalid", "contact", null);
        contactFName = contactEscalationEmailSearchResultSet.getValue("firstname", "contact", null);
        contactLName = contactEscalationEmailSearchResultSet.getValue("lastname", "contact", null);
        contactEmail = contactEscalationEmailSearchResultSet.getValue("email", "contact", null);
        contactPhone = contactEscalationEmailSearchResultSet.getValue("phone", "contact", null);


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
                recContact.setFieldValue('custentity_create_password_email_count', createPasswordEmailCount);
                nlapiSubmitRecord(recContact);
            } else {
                var recContact = nlapiLoadRecord('contact', contactInternalId);
                recContact.setFieldValue('custentity_create_password_email_count', (createPasswordEmailCount + 1));
                nlapiSubmitRecord(recContact);

                //Create JSON with contact details & customer internal id to be passed to API
                var userJSON = '{';
                userJSON += '"customer_ns_id" : "' + customerInternalId + '",'
                userJSON += '"first_name" : "' + contactFName + '",'
                userJSON += '"last_name" : "' + contactLName + '",'
                userJSON += '"email" : "' + contactEmail + '",'
                userJSON += '"phone" : "' + contactPhone + '"'
                userJSON += '}';

                //API headers
                var headers = {};
                headers['Content-Type'] = 'application/json';
                headers['Accept'] = 'application/json';
                headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';

                //Hit RTA API to create new staff
                nlapiRequestURL('https://mpns.protechly.com/new_staff', userJSON,
                    headers);

                var emailMerger = nlapiCreateEmailMerger(393);
                var subject = "Please complete the set-up of your portal";
                var mergeResult = emailMerger.merge();
                var emailBody = mergeResult.getBody();
                emailBody = emailBody.replace(/<NLEMCUSTOMERID>/gi, customerID);
                var emailAttach = new Object();
                emailAttach['entity'] = customerInternalId;

                nlapiSendEmail(112209, contactEmail, subject, emailBody,
                    null,
                    null, emailAttach, null, true);
            }

        }

        return true;
    });
    // } else {
    //     var headers = {};
    //     headers['Content-Type'] = 'application/json';
    //     headers['Accept'] = 'application/json';
    //     headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';
    //     var mainURL = 'https://mpns.protechly.com/outbound_emails?email=' + contactEmail;
    //     var response = nlapiRequestURL(mainURL, null, headers);

    //     var body = response.body;

    //     nlapiLogExecution('DEBUG', 'body', body);

    //     if (isNullorEmpty(body)) {

    //     } else {
    //         var emailSubjects = JSON.parse(body);
    //         nlapiLogExecution('DEBUG', 'emailSubjects', emailSubjects);
    //         var emailSubjectsLength = emailSubjects.length;
    //         nlapiLogExecution('DEBUG', 'emailSubjectsLength', emailSubjectsLength);

    //         var accountActivated = false;
    //         var createPasswordEmailCount = 0;

    //         for (var x = 0; x < emailSubjectsLength; x++) {
    //             if (emailSubjects[x].subject == 'Welcome to your MailPlus Shipping Portal.') {
    //                 accountActivated = true;
    //             } else if (emailSubjects[x].subject == 'Your MailPlus shipping portal is now ready for you to set up.') {
    //                 createPasswordEmailCount++;
    //             }
    //         }

    //         if (accountActivated == true) {
    //             var recContact = nlapiLoadRecord('contact', contactInternalId);
    //             recContact.setFieldValue('custentity_password_setup_completed', 1);
    //             recContact.setFieldValue('custentity_create_password_email_count', createPasswordEmailCount);
    //             nlapiSubmitRecord(recContact);
    //         } else {
    //             var recContact = nlapiLoadRecord('contact', contactInternalId);
    //             recContact.setFieldValue('custentity_create_password_email_count', (createPasswordEmailCount + 1));
    //             nlapiSubmitRecord(recContact);
    //             //Create JSON with contact details & customer internal id to be passed to API
    //             var userJSON = '{';
    //             userJSON += '"customer_ns_id" : "' + customerInternalId + '",'
    //             userJSON += '"first_name" : "' + contactFName + '",'
    //             userJSON += '"last_name" : "' + contactLName + '",'
    //             userJSON += '"email" : "' + contactEmail + '",'
    //             userJSON += '"phone" : "' + contactPhone + '"'
    //             userJSON += '}';

    //             //API headers
    //             var headers = {};
    //             headers['Content-Type'] = 'application/json';
    //             headers['Accept'] = 'application/json';
    //             headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';

    //             //Hit RTA API to create new staff
    //             nlapiRequestURL('https://mpns.protechly.com/new_staff', userJSON,
    //                 headers);
    //         }

    //     }
    // }

}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);

    return date;
}
