/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-02-12 16:42:04   		Ankith 
 *
 * Remarks: New Address Module (Client)         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2019-05-07 10:26:47
 *
 */
var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})

$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

});

$(document).on('click', '#alert .close', function(e) {
    $(this).parent().hide();
});

function showAlert(message) {
    $('#alert').html('<button type="button" class="close">&times;</button>' + message);
    $('#alert').show();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('click', '#alert .close', function(e) {
    $(this).parent().hide();
});

function pageInit() {
    $('#alert').hide();
}

function reset_all() {
    $('.row_salutation').addClass('hide');
    $('.row_name').addClass('hide');
    $('.row_details').addClass('hide');
    $('.row_category').addClass('hide');
    $('.row_admin').addClass('hide');
    $('.row_button').addClass('hide');
    $('.create_new_contact_button').removeClass('hide');
    $('#salutation').val('');
    $('#first_name').val('');
    $('#last_name').val('');
    $('#email').val('');
    $('#role').val(0);
    $('#portal_admin').val(0);
    $('#phone').val('');
    $('#position').val('');
    $('#contact_id').val('');


    $('.add_contact_section').addClass('hide');
    $('.edit_contact_section').addClass('hide');
}


$(document).on('click', '#create_new_contact', function(e) {
    $('.row_salutation').removeClass('hide');
    $('.row_name').removeClass('hide');
    $('.row_details').removeClass('hide');
    $('.row_category').removeClass('hide');
    $('.row_admin').removeClass('hide');
    $('.row_button').removeClass('hide');
    $('.create_new_contact_button').addClass('hide');
    $('.add_contact_section').removeClass('hide');
    $('.edit_contact_section').addClass('hide');
});


$(document).on('click', '#clear', function(event) {
    reset_all();
});

$(document).on('click', '.remove_class', function(event) {
    var contactid = $(this).attr('data-contactid');

    if (confirm("Are you sure you want to delete this contact?\n\nThis action cannot be undone.")) {
        if (!isNullorEmpty(contactid)) {

            var recContact = nlapiLoadRecord('contact', contactid);

            recContact.setFieldValue('isinactive', 'T');
            nlapiSubmitRecord(recContact);
        }

        $(this).closest("tr").remove();
        return true;
    } else {
        $(this).closest("tr").remove();
        return false;
    }


});

$(document).on('click', '.edit_class', function(event) {

    reset_all();

    $('.create_new_contact_button').addClass('hide');
    $('.row_salutation').removeClass('hide');
    $('.row_name').removeClass('hide');
    $('.row_details').removeClass('hide');
    $('.row_category').removeClass('hide');
    $('.row_admin').removeClass('hide');
    $('.row_button').removeClass('hide');
    $('.add_contact_section').addClass('hide');
    $('.edit_contact_section').removeClass('hide');
    $('#edit_contact').removeClass('hide');

    var contactid = $(this).attr('data-contactid');
    var row_id = $(this).attr('data-rowid');
    var salutation = $(this).closest('tr').find('.salutation').attr('data-id');
    var first_name = $(this).closest('tr').find('.first_name').val();
    var last_name = $(this).closest('tr').find('.last_name').val();
    var email = $(this).closest('tr').find('.email').val();
    var phone = $(this).closest('tr').find('.phone').val();
    var position = $(this).closest('tr').find('.position').val();
    var role = $(this).closest('tr').find('.role').attr('data-id');
    var role_text = $(this).closest('tr').find('.role').val();
    var portal_admin = $(this).closest('tr').find('.portal_admin').attr('data-id');
    var portal_admin_text = $(this).closest('tr').find('.portal_admin').val();
    var portal_user = $(this).closest('tr').find('.portal_user').attr('data-id');
    var portal_user_text = $(this).closest('tr').find('.portal_user').val();


    nlapiSetFieldValue('custpage_edit_contact', 'T');

    $('#salutation').val(salutation);
    $('#first_name').val(first_name);
    $('#last_name').val(last_name);
    $('#email').val(email);

    console.log(portal_admin)
    console.log(portal_user)
    console.log(portal_admin_text)
    console.log(portal_user_text)


    var searched_contact_roles = nlapiLoadSearch('contactrole', 'customsearch_salesp_contact_roles');

    var newFilters = new Array();
    newFilters[newFilters.length] = new nlobjSearchFilter('name', null, 'is', role_text);

    searched_contact_roles.addFilters(newFilters);
    var resultSet_contact_roles = searched_contact_roles.runSearch();

    var count = 0;

    resultSet_contact_roles.forEachResult(function(searchResult_contact_roles) {

        if (count == 0) {
            var id = searchResult_contact_roles.getValue('internalid');
            var name = searchResult_contact_roles.getValue('name');
            $('#role').val(id);
        }
        count++;
        return true;
    });


    $('#portal_admin').val(portal_admin);
    $('#portal_user').val(portal_user);
    $('#phone').val(phone);
    $('#position').val(position);
    $('#contact_id').val(contactid);
    $('#row_id').val(row_id);

});



$(document).on('click', '#add_contact', function(e) {

    var contact_id = $('#contact_id').val();
    var salutation = $('#salutation').val();
    var salutation_text = $('#salutation').val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var email = $('#email').val();
    var role = $('#role option:selected').val();
    var portal_admin = $('#portal_admin option:selected').val();
    var portal_user = $('#portal_user option:selected').val();
    var role_text = $('#role option:selected').text();
    var portal_admin_text = $('#portal_admin option:selected').text();
    var portal_user_text = $('#portal_user option:selected').text();
    var phone = $('#phone').val();
    var position = $('#position').val();

    nlapiSetFieldValue('custpage_edit_contact', 'F');

    if ((isNullorEmpty(salutation))) {
        showAlert('Please Select Salutation');
        return false;

    }
    if ((isNullorEmpty(first_name))) {
        showAlert('Please Enter the First Name');
        return false;

    }
    if ((isNullorEmpty(email))) {
        showAlert('Please Enter the Email ID');
        return false;

    }
    if ((isNullorEmpty(phone))) {
        showAlert('Please Enter Phone Number');
        return false;

    } else {
        var result = validatePhone(phone);
        if (result == false) {
            return false;
        }
    }
    if ((isNullorEmpty(role))) {
        showAlert('Please Select a Role');
        return false;

    }


    var inlineQty = '';

    if (isNullorEmpty(contact_id)) {
        var row_count = $('#contact tr').length;
        inlineQty += '<tr><td class="first_col"><button class="btn btn-warning btn-sm edit_class glyphicon glyphicon-pencil" type="button" data-toggle="tooltip" data-rowid="' + (row_count - 1) + '" data-contactid="' + null + '" data-placement="right" title="Edit"></button><br/><button class="btn btn-danger btn-sm remove_class glyphicon glyphicon-trash" type="button" data-toggle="tooltip" data-placement="right" data-rowid="' + (row_count - 1) + '" data-contactid="' + null + '" title="Delete"></button></td>';

        inlineQty += '<td><input type="text" class="form-control salutation" disabled data-id="' + salutation + '" value="' + salutation_text + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control first_name" disabled value="' + first_name + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control last_name" disabled value="' + last_name + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control email" disabled value="' + email + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control phone" disabled value="' + phone + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control position" disabled value="' + position + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control role" disabled data-id="' + role + '" value="' + role_text + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control portal_admin" disabled data-id="' + portal_admin + '" value="' + portal_admin_text + '"  /></td>';
        inlineQty += '<td><input type="text" class="form-control portal_user" disabled data-id="' + portal_user + '" value="' + portal_user_text + '"  /></td>';
        inlineQty += '</tr>';

        $('#contact tr:last').after(inlineQty);
    }

    reset_all();
});



$(document).on('click', '#edit_contact', function(e) {

    nlapiSetFieldValue('custpage_edit_contact', 'F');

    var contact_id = $('#contact_id').val();
    var row_count = ($('#row_id').val() - 1);
    var salutation = $('#salutation').val();
    var salutation_text = $('#salutation').val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var email = $('#email').val();
    var role = $('#role option:selected').val();
    var role_text = $('#role option:selected').text();
    var phone = $('#phone').val();
    var position = $('#position').val();
    var portal_admin = $('#portal_admin option:selected').val();
    var portal_admin_text = $('#portal_admin option:selected').text();
    var portal_user = $('#portal_user option:selected').val();
    var portal_user_text = $('#portal_user option:selected').text();

    console.log(first_name)
    console.log(portal_admin)
    console.log(portal_admin_text)
    console.log(portal_user)
    console.log(portal_user_text)

    if ((isNullorEmpty(salutation))) {
        showAlert('Please Select Salutation');
        return false;

    }
    if ((isNullorEmpty(first_name))) {
        showAlert('Please Enter the First Name');
        return false;

    }
    if ((isNullorEmpty(email))) {
        showAlert('Please Enter the Email ID');
        return false;

    }
    if ((isNullorEmpty(phone))) {
        showAlert('Please Enter Phone Number');
        return false;

    } else {
        var result = validatePhone(phone);
        if (result == false) {
            return false;
        }
    }
    if ((isNullorEmpty(role))) {
        showAlert('Please Select a Role');
        return false;

    }

    var edit_class_elem = document.getElementsByClassName("edit_class");
    var salutation_elem = document.getElementsByClassName("salutation");
    var first_name_elem = document.getElementsByClassName("first_name");
    var last_name_elem = document.getElementsByClassName("last_name");
    var email_elem = document.getElementsByClassName("email");
    var phone_elem = document.getElementsByClassName("phone");
    var position_elem = document.getElementsByClassName("position");
    var role_elem = document.getElementsByClassName("role");
    var portal_admin_elem = document.getElementsByClassName("portal_admin");
    var portal_user_elem = document.getElementsByClassName("portal_user");

    console.log(edit_class_elem.length)

    if (!isNullorEmpty(contact_id)) {
        for (var i = 0; i < edit_class_elem.length; ++i) {
            var row_contact_id = edit_class_elem[i].getAttribute('data-contactid');
            if (contact_id == row_contact_id) {

                salutation_elem[i].value = salutation_text
                salutation_elem[i].setAttribute('data-id', salutation);
                first_name_elem[i].value = first_name;
                last_name_elem[i].value = last_name;
                phone_elem[i].value = phone;
                email_elem[i].value = email;
                position_elem[i].value = position;
                role_elem[i].value = role_text;
                portal_admin_elem[i].value = portal_admin_text;
                portal_admin_elem[i].setAttribute('data-id', portal_admin);
                role_elem[i].setAttribute('data-id', role);
                portal_user_elem[i].value = portal_user_text;
                portal_user_elem[i].setAttribute('data-id', portal_user);
            }
        }
    } else {
        salutation_elem[row_count].value = salutation_text
        salutation_elem[row_count].setAttribute('data-id', salutation);
        first_name_elem[row_count].value = first_name;
        last_name_elem[row_count].value = last_name;
        phone_elem[row_count].value = phone;
        email_elem[row_count].value = email;
        position_elem[row_count].value = position;
        role_elem[row_count].value = role_text;
        portal_admin_elem[row_count].value = portal_admin_text;
        portal_admin_elem[row_count].setAttribute('data-id', portal_admin);
        role_elem[row_count].setAttribute('data-id', role);
        portal_user_elem[row_count].value = portal_user_text;
        portal_user_elem[row_count].setAttribute('data-id', portal_user);
    }
    reset_all();
});


function updateContact(submit) {
    var customer_id = parseInt(nlapiGetFieldValue('custpage_customer_id'));

    var edit_class_elem = document.getElementsByClassName("edit_class");
    var salutation_elem = document.getElementsByClassName("salutation");
    var first_name_elem = document.getElementsByClassName("first_name");
    var last_name_elem = document.getElementsByClassName("last_name");
    var email_elem = document.getElementsByClassName("email");
    var phone_elem = document.getElementsByClassName("phone");
    var position_elem = document.getElementsByClassName("position");
    var role_elem = document.getElementsByClassName("role");
    var portal_admin_elem = document.getElementsByClassName("portal_admin");
    var portal_user_elem = document.getElementsByClassName("portal_user");


    for (var i = 0; i < edit_class_elem.length; ++i) {
        var row_contact_id = edit_class_elem[i].getAttribute('data-contactid');

        var salutation = salutation_elem[i].getAttribute('data-id');
        var salutation_text = salutation_elem[i].value;
        var first_name = first_name_elem[i].value;
        var last_name = last_name_elem[i].value;
        var email = email_elem[i].value;
        var phone = phone_elem[i].value;
        var position = position_elem[i].value;
        var role_text = role_elem[i].value;
        var role = role_elem[i].getAttribute('data-id');
        var portal_admin_text = portal_admin_elem[i].value;
        console.log(1);
        var portal_admin = portal_admin_elem[i].getAttribute('data-id');
        console.log(2);
        var portal_user_text = portal_user_elem[i].value;
        console.log(3);
        var portal_user = portal_user_elem[i].getAttribute('data-id');
        console.log(4);

        console.log(role);
        console.log(row_contact_id);
        console.log(portal_user);
        console.log(portal_user);


        if (!isNullorEmpty(role)) {
            if (isNullorEmpty(row_contact_id)) {
                var recContact = nlapiCreateRecord('contact')
            } else {
                var recContact = nlapiLoadRecord('contact', row_contact_id)
            }
            recContact.setFieldValue('salutation', salutation);
            recContact.setFieldValue('firstname', first_name);
            recContact.setFieldValue('lastname', last_name);
            recContact.setFieldValue('email', email);
            recContact.setFieldValue('phone', phone);
            recContact.setFieldValue('title', position);
            recContact.setFieldValue('company', customer_id);
            recContact.setFieldValue('entityid', first_name + ' ' + last_name);
            recContact.setFieldValue('contactrole', role);
            if(!isNullorEmpty(portal_admin) && portal_admin != 3){
            	recContact.setFieldValue('custentity_connect_admin', portal_admin);
            }
            if(!isNullorEmpty(portal_user)&& portal_user != 3){
            	recContact.setFieldValue('custentity_connect_user', portal_user);
            }
            
            

            nlapiSubmitRecord(recContact);
        }


    }

    return true;
}

function saveRecord() {

    var result = updateContact();

    if (result == true) {
        return true;
    }

}

function onclick_back() {
    var params = {
        custid: parseInt(nlapiGetFieldValue('custpage_customer_id')),
        custId: parseInt(nlapiGetFieldValue('custpage_customer_id')),
        sales_record_id: nlapiGetFieldValue('custpage_sales_record_id'),
        uploaded_file: nlapiGetFieldValue('custpage_uploaded'),
        custpage_uploaded_id: nlapiGetFieldValue('custpage_uploaded_id'),
        callcenter: nlapiGetFieldValue('custpage_callcenter'),
        type: nlapiGetFieldValue('custpage_type')
    }
    params = JSON.stringify(params);
    var upload_url = baseURL + nlapiResolveURL('SUITELET', nlapiGetFieldValue('custpage_suitlet'), nlapiGetFieldValue('custpage_deploy')) + '&unlayered=T&custparam_params=' + params;
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
}

function validatePhone(phone) {
    var val = phone;
    var digits = val.replace(/[^0-9]/g, '');
    var australiaPhoneFormat = /^(\+\d{2}[ \-]{0,1}){0,1}(((\({0,1}[ \-]{0,1})0{0,1}\){0,1}[2|3|7|8]{1}\){0,1}[ \-]*(\d{4}[ \-]{0,1}\d{4}))|(1[ \-]{0,1}(300|800|900|902)[ \-]{0,1}((\d{6})|(\d{3}[ \-]{0,1}\d{3})))|(13[ \-]{0,1}([\d \-]{5})|((\({0,1}[ \-]{0,1})0{0,1}\){0,1}4{1}[\d \-]{8,10})))$/;
    var phoneFirst6 = digits.substring(0, 6);

    //Check if all phone characters are numerals
    if (val != digits) {
        showAlert('Phone numbers should contain numbers only.\n\nPlease re-enter the phone number without spaces or special characters.');
        return false;
    } else if (digits.length != 10) {
        //Check if phone is not blank, need to contains 10 digits
        showAlert('Please enter a 10 digit phone number with area code.');
        return false;
    } else if (!(australiaPhoneFormat.test(digits))) {
        //Check if valid Australian phone numbers have been entered
        showAlert('Please enter a valid Australian phone number.\n\nNote: 13 or 12 numbers are not accepted');
        return false;
    } else if (digits.length == 10) {
        //Check if all 10 digits are the same numbers using checkDuplicate function
        if (checkDuplicate(digits)) {
            showAlert('Please enter a valid 10 digit phone number.');
            return false;
        }
    }
}

function checkDuplicate(digits) {
    var digit01 = digits.substring(0, 1);
    var digit02 = digits.substring(1, 2);
    var digit03 = digits.substring(2, 3);
    var digit04 = digits.substring(3, 4);
    var digit05 = digits.substring(4, 5);
    var digit06 = digits.substring(5, 6);
    var digit07 = digits.substring(6, 7);
    var digit08 = digits.substring(7, 8);
    var digit09 = digits.substring(8, 9);
    var digit10 = digits.substring(9, 10);

    if (digit01 == digit02 && digit02 == digit03 && digit03 == digit04 && digit04 == digit05 && digit05 == digit06 && digit06 == digit07 && digit07 == digit08 && digit08 == digit09 && digit09 == digit10) {
        return true;
    } else {
        return false;
    }
}