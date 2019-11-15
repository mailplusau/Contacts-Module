/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-02-12 16:42:05   	Ankith 
 *
 * Remarks: New Address Module        
 * 
 * @Last Modified by:   ankith.ravindran
 * @Last Modified time: 2019-05-07 10:27:19
 *
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

var zee = 0;
var role = nlapiGetRole();

if (role == 1000) {
    zee = nlapiGetUser();
} else if (role == 3) { //Administrator
    zee = 6; //test
} else if (role == 1032) { // System Support
    zee = 425904; //test-AR
}

function contacts_creation(request, response) {

    if (request.getMethod() === "GET") {

        var params = request.getParameter('params');

        if (isNullorEmpty(params)) {
            var params = request.getParameter('custparam_params');
        }

        entryParamsString = params;

        params = JSON.parse(params);

        var recCustomer = nlapiLoadRecord('customer', params.custid);

        var form = nlapiCreateForm('Contact Review: <a href="' + baseURL + '/app/common/entity/custjob.nl?id=' + params.custid + '">' + recCustomer.getFieldValue('entityid') + '</a> ' + recCustomer.getFieldValue('companyname'));

        form.addField('custpage_customer_id', 'integer', 'Customer ID').setDisplayType('hidden').setDefaultValue(params.custid);
        form.addField('custpage_sales_record_id', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.sales_record_id);
        form.addField('custpage_suitlet', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.id);
        form.addField('custpage_deploy', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.deploy);

        form.addField('custpage_edit_contact', 'text', 'Edit Contact').setDisplayType('hidden').setDefaultValue('F');
        form.addField('custpage_callcenter', 'text', 'Edit Contact').setDisplayType('hidden').setDefaultValue(params.callcenter);
        form.addField('custpage_uploaded', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.uploaded_file);
        form.addField('custpage_uploaded_id', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.custpage_uploaded_id);
        form.addField('custpage_type', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.type);
        form.addField('custpage_suspects', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.suspects);



        var inlineQty = '';

        var inlinehtml2 = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><style>.mandatory{color:red;}</style>';


        var searched_contact = nlapiLoadSearch('contact', 'customsearch_salesp_contacts');

        var newFilters_contact = new Array();
        newFilters_contact[newFilters_contact.length] = new nlobjSearchFilter('company', null, 'is', params.custid);
        newFilters_contact[newFilters_contact.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

        searched_contact.addFilters(newFilters_contact);

        var resultSet_contacts = searched_contact.runSearch();

        var contactResult = resultSet_contacts.getResults(0, 1);


        var searched_contact_roles = nlapiLoadSearch('contactrole', 'customsearch_salesp_contact_roles');


        var resultSet_contact_roles = searched_contact_roles.runSearch();

        inlinehtml2 += '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl"><div style=\"background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;width:96%;position:absolute\"><b><u>Important Instructions:</u></b></div><br/><br/><br><br><br><br><div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in "></div>';

        inlineQty += '<form id="myForm">'

        inlineQty += '<div class="form-group container create_new_contact_button">';
        inlineQty += '<div class="row">';
        inlineQty += '<div class="create_new_contact_section col-xs-3"><input type="button" value="CREATE CONTACT" class="form-control btn btn-primary" id="create_new_contact" /></div>'
        inlineQty += '</div>';
        inlineQty += '</div>';

        inlineQty += '<div class="form-group container row_salutation hide">';
        inlineQty += '<div class="row">'

        inlineQty += '<div class="col-xs-2 salutation_section"><div class="input-group"><span class="input-group-addon">MR. / MRS. <span class="mandatory">*</span></span><input type="hidden" id="contact_id" value="" /><input type="hidden" id="row_id" value="" /><input type="text" id="salutation" class="form-control"  /></div></div>';
        inlineQty += '<div class="col-xs-4 first_name_section"><div class="input-group"><span class="input-group-addon">FIRST NAME <span class="mandatory">*</span></span><input type="text" id="first_name" class="form-control " /></div></div>';
        inlineQty += '<div class="col-xs-4 last_name_section"><div class="input-group"><span class="input-group-addon">LAST NAME</span><input type="text" id="last_name" class="form-control" /></div></div>';

        inlineQty += '</div>';
        inlineQty += '</div>';

        inlineQty += '<div class="form-group container row_details hide">';
        inlineQty += '<div class="row">'

        inlineQty += '<div class="col-xs-6 email_section"><div class="input-group"><span class="input-group-addon">EMAIL <span class="mandatory">*</span></span><input type="email" id="email" class="form-control " /></div></div>';
        inlineQty += '<div class="col-xs-4 phone_section"><div class="input-group"><span class="input-group-addon">PHONE </span><input type="number" id="phone" class="form-control " /></div></div>';

        inlineQty += '</div>';
        inlineQty += '</div>';

        inlineQty += '<div class="form-group container row_category hide">';
        inlineQty += '<div class="row">'

        inlineQty += '<div class="col-xs-3 position_section"><div class="input-group"><span class="input-group-addon">POSITION</span><input type="text" id="position" class="form-control " /></div></div>';
        inlineQty += '<div class="col-xs-3 role_section"><div class="input-group"><span class="input-group-addon">ROLE <span class="mandatory">*</span></span><select class="form-control " id="role"><option></option>';
        resultSet_contact_roles.forEachResult(function(searchResult_contact_roles) {

            var id = searchResult_contact_roles.getValue('internalid');
            var name = searchResult_contact_roles.getValue('name');
            inlineQty += '<option value="' + id + '">' + name + '</option>';
            return true;
        });
        inlineQty += '</select></div></div>';

        inlineQty += '</div>';
        inlineQty += '</div>';

        var columns = new Array();
        columns[0] = new nlobjSearchColumn('name');
        columns[1] = new nlobjSearchColumn('internalId');

        var yes_no_search = nlapiCreateSearch('customlist_yes_no_unsure', null, columns)
        var resultSetYesNo = yes_no_search.runSearch();

        inlineQty += '<div class="form-group container row_admin hide">';
        inlineQty += '<div class="row">'
        inlineQty += '<div class="col-xs-3 portal_admin_section"><div class="input-group"><span class="input-group-addon">CONNECT+ ADMIN </span><select class="form-control " id="portal_admin"><option></option>';
        resultSetYesNo.forEachResult(function(searchResult) {

            var listValue = searchResult.getValue('name');
            var listID = searchResult.getValue('internalId');

            inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
            return true;
        });
        inlineQty += '</select></div></div>';
        inlineQty += '<div class="col-xs-3 portal_user_section"><div class="input-group"><span class="input-group-addon">CONNECT+ USER </span><select class="form-control " id="portal_user"><option></option>';
        resultSetYesNo.forEachResult(function(searchResult) {

            var listValue = searchResult.getValue('name');
            var listID = searchResult.getValue('internalId');

            inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
            return true;
        });
        inlineQty += '</select></div></div>';

        inlineQty += '</div>';
        inlineQty += '</div>';



        inlineQty += '<div class="form-group container row_button hide">'
        inlineQty += '<div class="row">';

        inlineQty += '<div class="add_contact_section col-xs-3"><input type="button" value="ADD / EDIT" class="form-control btn btn-primary" id="add_contact" /></div><div class="col-xs-3 edit_contact_section"><input type="button" value="ADD / EDIT" class="form-control btn btn-primary hide" id="edit_contact" /></div><div class="clear_section col-xs-3"><input type="button" value="CANCEL" class="form-control btn btn-default" id="clear" /></div>';

        inlineQty += '</div>';
        inlineQty += '</div>';

        // End of Container
        inlineQty += '</div>';
        inlineQty += '</form>';

        /**
         * Description - To create the table and colums assiocted with the page.
         */
        inlineQty += '<br><br><style>table#contact {font-size:12px; text-align:center; border-color: #24385b}</style><div class="form-group container-fluid"><div><div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm" role="document"><div class="modal-content" style="width: max-content;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title panel panel-info" id="exampleModalLabel">Information</h4><br> </div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div><div ng-app="myApp" ng-controller="myCtrl"><table border="0" cellpadding="15" id="contact" class="table table-responsive table-striped contact tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr class="text-center">';
        /**
         * ACTION ROW
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;"><b>ACTION</b></th>';
        /**
         * SALUTATION
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>SALUTATION</b></th>';
        /**
         * FIRST NAME
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>FIRST NAME</b></th>';
        /**
         * LAST NAME
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>LAST NAME</b></th>';

        /**
         * EMAIL
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>EMAIL</b></th>';
        /**
         *PHONE
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class="" ><b>PHONE</b></th>';
        /**
         * POSITION
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>POSITION</b></th>';

        /**
         * ROLE
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>ROLE</b></th>';

        /**
         * CONNECT+ ADMIN
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>CONNECT+ ADMIN</b></th>';

        /**
         * CONNECT+ ADMIN
         */
        inlineQty += '<th style="vertical-align: middle;text-align: center;" class=""><b>CONNECT+ USER</b></th></thead><tbody>';

        var count = 0;
        if (contactResult.length != 0) {
            resultSet_contacts.forEachResult(function(searchResult_contacts) {


                var id = searchResult_contacts.getValue('internalid');
                var salutation = searchResult_contacts.getValue('salutation');
                var salutation_text = searchResult_contacts.getText('salutation');
                var first_name = searchResult_contacts.getValue('firstname');
                var last_name = searchResult_contacts.getValue('lastname');
                var email = searchResult_contacts.getValue('email');
                var phone = searchResult_contacts.getValue('phone');
                var position = searchResult_contacts.getValue('title');
                var role = searchResult_contacts.getValue('contactrole');
                var role_text = searchResult_contacts.getText('contactrole');
                var portal_admin = searchResult_contacts.getValue('custentity_connect_admin');
                var portal_user = searchResult_contacts.getValue('custentity_connect_user');
                var portal_admin_text = searchResult_contacts.getText('custentity_connect_admin');
                var portal_user_text = searchResult_contacts.getText('custentity_connect_user');


                inlineQty += '<tr class="text-center"><td class="first_col"><button class="btn btn-warning btn-sm edit_class glyphicon glyphicon-pencil" type="button" data-toggle="tooltip" data-rowid="' + count + '" data-contactid="' + id + '" data-placement="right" title="Edit"></button><br/><button class="btn btn-danger btn-sm remove_class glyphicon glyphicon-trash" type="button" data-toggle="tooltip" data-placement="right" data-rowid="' + count + '" data-contactid="' + id + '" title="Delete"></button></td>';

                inlineQty += '<td><input type="text" class="form-control salutation" disabled data-id="' + salutation + '" value="' + salutation + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control first_name" disabled value="' + first_name + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control last_name" disabled value="' + last_name + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control email" disabled value="' + email + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control phone" disabled value="' + phone + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control position" disabled value="' + position + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control role" disabled data-id="' + null + '" value="' + role_text + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control portal_admin" disabled data-id="' + portal_admin + '" value="' + portal_admin_text + '"  /></td>';
                inlineQty += '<td><input type="text" class="form-control portal_user" disabled data-id="' + portal_user + '" value="' + portal_user_text + '"  /></td>';


                inlineQty += '</tr>';
                count++;
                return true;
            });
        } else {
            inlineQty += '<tr></tr>'
        }


        inlineQty += '</tbody>';
        inlineQty += '</table></div></div></div></form><br/>';

        form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setDefaultValue(inlineQty);

        form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType('outsideabove').setDefaultValue(inlinehtml2);

        form.setScript('customscript_cl_contacts_module');

        form.addSubmitButton('Submit');
        form.addButton('back', 'Back', 'onclick_back()');
        form.addButton('back', 'Reset', 'onclick_reset()');

        response.writePage(form);

    } else {

        var customer_id = request.getParameter('custpage_customer_id');
        var sales_record_id = request.getParameter('custpage_sales_record_id');
        var suitlet_id = request.getParameter('custpage_suitlet');
        var deploy_id = request.getParameter('custpage_deploy');
        var uploaded = request.getParameter('custpage_uploaded');
        var uploaded_id = request.getParameter('custpage_uploaded_id');
        var callcentere = request.getParameter('custpage_callcenter');
        var type = request.getParameter('custpage_type');
        var suspects = request.getParameter('custpage_suspects');

        var params = {
            custid: parseInt(customer_id),
            custId: parseInt(customer_id),
            recid: parseInt(customer_id),
            sales_record_id: parseInt(sales_record_id),
            uploaded_file: uploaded,
            custpage_uploaded_id: uploaded_id,
            callcenter: callcentere,
            type: type,
            suspects: suspects
        }
        nlapiSetRedirectURL('SUITELET', suitlet_id, deploy_id, null, params);
    }
}