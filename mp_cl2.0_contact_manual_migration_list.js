/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * Author:               Ankith Ravindran
 * Created on:           Fri Apr 11 2023
 * Modified on:          Fri Apr 14 2023 11:39:43
 * SuiteScript Version:  2.0 
 * Description:          Client script for the Page that lists customres that have requested cancellation  
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
],
    function (email, runtime, search, record, http, log, error, url, format,
        currentRecord) {
        var zee = 0;
        var userId = 0;
        var role = 0;

        var baseURL = 'https://1048144.app.netsuite.com';
        if (runtime.EnvType == "SANDBOX") {
            baseURL = 'https://1048144-sb3.app.netsuite.com';
        }

        role = runtime.getCurrentUser().role;
        var userName = runtime.getCurrentUser().name;
        var userId = runtime.getCurrentUser().id;
        var currRec = currentRecord.get();

        var total_months = 14;

        var today = new Date();
        var today_day_in_month = today.getDate();
        var today_day_in_week = today.getDay();
        var today_month = today.getMonth() + 1;
        var today_year = today.getFullYear();

        if (today_day_in_month < 10) {
            today_day_in_month = '0' + today_day_in_month;
        }

        if (today_month < 10) {
            today_month = '0' + (today_month);
        }

        var todayString = today_day_in_month + '/' + today_month + '/' +
            today_year;

        var current_year_month = today_year + '-' + today_month;
        var difference_months = total_months - parseInt(today_month);


        function isWeekday(year, month, day) {
            var day = new Date(year, month, day).getDay();
            return day != 0 && day != 6;
        }

        function getWeekdaysInMonth(month, year) {
            var days = daysInMonth(month, year);
            var weekdays = 0;
            for (var i = 0; i < days; i++) {
                if (isWeekday(year, month, i + 1)) weekdays++;
            }
            return weekdays;
        }

        function daysInMonth(iMonth, iYear) {
            return 32 - new Date(iYear, iMonth, 32).getDate();
        }

        function pageLoad() {
            $('.range_filter_section').addClass('hide');
            $('.range_filter_section_top').addClass('hide');
            $('.date_filter_section').addClass('hide');
            $('.period_dropdown_section').addClass('hide');

            $('.loading_section').removeClass('hide');
        }


        function afterSubmit() {

            $('.loading_section').addClass('hide');

            $('.table_section').removeClass('hide');
            $('.cust_filter_section').removeClass('hide');
            $('.cust_dropdown_section').removeClass('hide');
            $('.zee_available_buttons_section').removeClass('hide');
            $('.instruction_div').removeClass('hide');
            $('.filter_buttons_section').removeClass('hide');
            $('.zee_label_section').removeClass('hide');
            $('.show_buttons_section').removeClass('hide');
            $('.zee_dropdown_section').removeClass('hide');
        }

        var paramUserId = null;

        function pageInit() {

            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");

            var val1 = currentRecord.get();
            paramUserId = val1.getValue({
                fieldId: 'custpage_sales_rep_id'
            });

            customerContactListDataSet = [];
            customerContactListSet = [];

            $("#applyFilter").click(function () {

                zee = $(
                    '#zee_dropdown option:selected').val();

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1745&deploy=1&zee=" + zee;

                window.location.href = url;
            });

            $("#clearFilter").click(function () {

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1745&deploy=1"

                window.location.href = url;

            });


            submitSearch();
            var dataTable = $('#mpexusage-customer_contact_list').DataTable();


            var today = new Date();
            var today_year = today.getFullYear();
            var today_month = today.getMonth();
            var today_day = today.getDate();

            /**
             *  Click for Instructions Section Collapse
             */
            $('.collapse').on('shown.bs.collapse', function () {
                $(".range_filter_section_top").css("padding-top", "500px");
            })
            $('.collapse').on('hide.bs.collapse', function () {
                $(".range_filter_section_top").css("padding-top", "0px");
            })

            $('.createPasswordEmail').click(function () {

                var contactInternalId = $(this).attr("data-id");

                console.log('contactInternalId: ' + contactInternalId);


                var contactRecord = record.load({
                    type: record.Type.CONTACT,
                    id: parseInt(contactInternalId),
                    isDynamic: true
                });

                contactRecord.setValue({
                    fieldId: 'custentity_create_password_email',
                    value: 1
                });

                contactRecord.save();

                var convertLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1';
                window.location.href = convertLink;
            })
            $('.accountActivated').click(function () {

                var contactInternalId = $(this).attr("data-id");

                console.log('contactInternalId: ' + contactInternalId);


                var contactRecord = record.load({
                    type: record.Type.CONTACT,
                    id: parseInt(contactInternalId),
                    isDynamic: true
                });

                contactRecord.setValue({
                    fieldId: 'custentity_password_setup_completed',
                    value: 1
                });

                contactRecord.save();

                var convertLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1745&deploy=1';
                window.location.href = convertLink;
            })



            //On click of close icon in the modal
            $('.close').click(function () {
                $("#myModal").hide();
            });

        }

        //Initialise the DataTable with headers.
        function submitSearch() {
            // duringSubmit();

            dataTable = $('#mpexusage-customer_contact_list').DataTable({
                destroy: true,
                data: customerContactListDataSet,
                pageLength: 1000,
                order: [[4, 'asc']],
                columns: [{
                    title: ''
                }, {
                    title: 'ID'
                }, {
                    title: 'COMPANY NAME'
                }, {
                    title: 'FRANCHISEE'
                }, {
                    title: 'CONTACT CREATED'
                }, {
                    title: 'CONTACT INTERNAL ID'
                }, {
                    title: 'CONTACT NAME'
                }, {
                    title: 'CONTACT EMAIL'
                }, {
                    title: 'CONTACT PHONE'
                }, {
                    title: 'CREATE PASSWORD EMAIL SENT?'
                }, {
                    title: 'ACCOUNT ACTIVATED'
                }, {
                    title: 'CURRENT STATUS'
                }],
                columnDefs: [{
                    targets: [2, 3, 9, 10, 11],
                    className: 'bolded'
                }, {
                    targets: [2, 11],
                    className: 'col-xs-3'
                }],
                rowCallback: function (row, data, index) {
                    if (!isNullorEmpty(data[11])) {
                        if (data[11] == 'MANUAL BARCODES USED') {
                            $('td', row).css('background-color', '#ff9090');
                        } else if (data[11] == 'NO MANUAL BARCODES USED') {
                            $('td', row).css('background-color', '#86c8bc');
                        } else {
                            $('td', row).css('background-color', '#adcf9f');
                        }
                    } else if (data[9] == 'Yes' && data[10] == 'Yes') {
                        $('td', row).css('background-color', '#adcf9f');
                    } else if (data[9] == 'Yes' && data[10] != 'Yes') {
                        $('td', row).css('background-color', '#ffd7a5');
                    }
                }
            });

            loadSearch();
            afterSubmit();
        }

        function loadSearch() {

            zee = $(
                '#zee_dropdown option:selected').val();

            //Search Name: Customer Contacts - Mail/Parcel Operator Role
            var custContactListMailOperatorRoleSearch = search.load({
                type: 'customer',
                id: 'customsearch_cust_contact_mail_parcel_ro'
            });

            if (!isNullorEmpty(zee)) {
                custContactListMailOperatorRoleSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee
                }));
            }

            custContactListMailOperatorRoleSearch.run().each(function (
                custContactListMailOperatorRoleResultSet) {

                var custInternalID = custContactListMailOperatorRoleResultSet.getValue({
                    name: 'internalid'
                });
                var custEntityID = custContactListMailOperatorRoleResultSet.getValue({
                    name: 'entityid'
                });
                var custName = custContactListMailOperatorRoleResultSet.getValue({
                    name: 'companyname'
                });
                var zeeID = custContactListMailOperatorRoleResultSet.getValue({
                    name: 'partner'
                });
                var zeeName = custContactListMailOperatorRoleResultSet.getText({
                    name: 'partner'
                });
                var contactCreated = custContactListMailOperatorRoleResultSet.getValue({
                    name: 'datecreated',
                    join: "contact",
                });

                var contactInternalId = custContactListMailOperatorRoleResultSet.getValue({
                    name: "internalid",
                    join: "contact",
                });

                var contactName = custContactListMailOperatorRoleResultSet.getValue({
                    name: "entityid",
                    join: "contact",
                });

                var contactEmail = custContactListMailOperatorRoleResultSet.getValue({
                    name: "email",
                    join: "contact",
                });

                var contactPhone = custContactListMailOperatorRoleResultSet.getValue({
                    name: "phone",
                    join: "contact",
                });


                var contactCreatePasswordEmail = custContactListMailOperatorRoleResultSet.getValue({
                    name: "custentity_create_password_email",
                    join: "contact",
                });

                if (contactCreatePasswordEmail == 1) {
                    contactCreatePasswordEmail = 'Yes'
                } else {
                    contactCreatePasswordEmail = ''
                }


                var contactPasswordSetupCompleted = custContactListMailOperatorRoleResultSet.getValue({
                    name: "custentity_password_setup_completed",
                    join: "contact",
                });

                if (contactPasswordSetupCompleted == 1) {
                    contactPasswordSetupCompleted = 'Yes'
                } else {
                    contactPasswordSetupCompleted = ''
                }


                customerContactListSet.push({
                    custInternalID: custInternalID,
                    custEntityID: custEntityID,
                    custName: custName,
                    zeeID: zeeID,
                    zeeName: zeeName,
                    contactCreated: contactCreated,
                    contactInternalId: contactInternalId,
                    contactName: contactName,
                    contactEmail: contactEmail,
                    contactPhone: contactPhone,
                    contactCreatePasswordEmail: contactCreatePasswordEmail,
                    contactPasswordSetupCompleted: contactPasswordSetupCompleted
                });

                return true;
            });

            console.log(customerContactListSet)

            loadDatatable(customerContactListSet);
            debt_set = [];

        }

        function loadDatatable(customerContactListRows) {

            customerContactListDataSet = [];
            csvSet = [];


            if (!isNullorEmpty(customerContactListRows)) {
                customerContactListRows.forEach(function (customerContactListRow, index) {

                    var contactCreatedArray = customerContactListRow.contactCreated.split(' ');
                    var contactCreatedDateSplit = contactCreatedArray[0].split('/');

                    if (parseInt(contactCreatedDateSplit[1]) < 10) {
                        contactCreatedDateSplit[1] = '0' + contactCreatedDateSplit[1]
                    }

                    if (parseInt(contactCreatedDateSplit[0]) < 10) {
                        contactCreatedDateSplit[0] = '0' + contactCreatedDateSplit[0]
                    }

                    var contactCreatedDateSplitString = contactCreatedDateSplit[2] + '-' + contactCreatedDateSplit[1] + '-' +
                        contactCreatedDateSplit[0];

                    var date_from = dateISOToNetsuite(contactCreatedDateSplitString);

                    console.log('date_from: ' + date_from)
                    console.log('customerContactListRow.custInternalID: ' + customerContactListRow.custInternalID)



                    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                    var firstDay = new Date(y, m, 1);
                    var lastDay = new Date(y, m + 1, 0);

                    firstDay.setHours(0, 0, 0, 0);
                    lastDay.setHours(0, 0, 0, 0);

                    firstDay = GetFormattedDate(firstDay);
                    lastDay = GetFormattedDate(lastDay);



                    if (customerContactListRow.contactCreatePasswordEmail == 'Yes' && customerContactListRow.contactPasswordSetupCompleted == 'Yes') {
                        //Search Name: All MP Products - Source/Week
                        var mpProductSourcePerWeekSearch = search.load({
                            type: 'customrecord_customer_product_stock',
                            id: 'customsearch_prod_stock_usage_report___6'
                        });

                        mpProductSourcePerWeekSearch.filters.push(search.createFilter({
                            name: 'internalid',
                            join: 'custrecord_cust_prod_stock_customer',
                            operator: search.Operator.IS,
                            values: parseInt(customerContactListRow.custInternalID)
                        }));

                        mpProductSourcePerWeekSearch.filters.push(search.createFilter({
                            name: 'custrecord_barcode_source',
                            operator: search.Operator.ANYOF,
                            values: ["1", "@NONE@"]
                        }));

                        mpProductSourcePerWeekSearch.filters.push(search.createFilter({
                            name: 'custrecord_cust_date_stock_used',
                            join: null,
                            operator: search.Operator.ONORAFTER,
                            values: date_from
                        }));

                        console.log('mpProductSourcePerWeekSearch.run(): ' + mpProductSourcePerWeekSearch.run())

                        var resultRange = mpProductSourcePerWeekSearch.run().getRange({
                            start: 0,
                            end: 1
                        });

                        if (resultRange.length == 0) {
                            //Search Name: All MP Products - Source/Week
                            var mpProductSourcePerWeekSearch = search.load({
                                type: 'customrecord_customer_product_stock',
                                id: 'customsearch_prod_stock_usage_report___6'
                            });

                            mpProductSourcePerWeekSearch.filters.push(search.createFilter({
                                name: 'internalid',
                                join: 'custrecord_cust_prod_stock_customer',
                                operator: search.Operator.IS,
                                values: parseInt(customerContactListRow.custInternalID)
                            }));

                            mpProductSourcePerWeekSearch.filters.push(search.createFilter({
                                name: 'custrecord_barcode_source',
                                operator: search.Operator.NONEOF,
                                values: ["1", "@NONE@"]
                            }));

                            mpProductSourcePerWeekSearch.filters.push(search.createFilter({
                                name: 'custrecord_cust_date_stock_used',
                                join: null,
                                operator: search.Operator.ONORAFTER,
                                values: date_from
                            }));

                            console.log('mpProductSourcePerWeekSearch.run(): ' + mpProductSourcePerWeekSearch.run())

                            var resultRange = mpProductSourcePerWeekSearch.run().getRange({
                                start: 0,
                                end: 1
                            });
                            if (resultRange.length == 0) {
                                var currentStatus = 'NO USAGE'
                                var linkURL = '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>'
                            } else {
                                var currentStatus = 'NO MANUAL BARCODES USED'

                                var linkURL = '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>'
                            }

                        } else {
                            var currentStatus = 'MANUAL BARCODES USED'
                            var linkURL = '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>'
                        }


                    } else if (customerContactListRow.contactCreatePasswordEmail != 'Yes' && customerContactListRow.contactPasswordSetupCompleted != 'Yes') {
                        var linkURL = ''
                        var currentStatus = ''
                        if (role == 3 || role == 1032) { //Administrator or System Support
                            linkURL =
                                '<input type="button" id="" data-id="' +
                                customerContactListRow.contactInternalId +
                                '" value="CREATE PASSWORD EMAIL SENT" class="form-control btn btn-xs btn-primary createPasswordEmail" style="font-weight: bold; cursor: pointer !important;width: fit-content;" /> <a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>';
                        } else {
                            var linkURL = '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>'
                        }

                    } else if (customerContactListRow.contactCreatePasswordEmail == 'Yes' && customerContactListRow.contactPasswordSetupCompleted != 'Yes') {
                        var linkURL = ''
                        var currentStatus = ''
                        if (role == 3 || role == 1032) { //Administrator or System Support
                            linkURL =
                                '<input type="button" id="" data-id="' +
                                customerContactListRow.contactInternalId +
                                '" value="ACCOUNT ACTIVATED" class="form-control btn btn-xs btn-success accountActivated" style="font-weight: bold; cursor: pointer !important;width: fit-content;" /> <a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>';
                        } else {
                            var linkURL = '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&start_date=' + contactCreatedDateSplitString + '&last_date=' + lastDay + '&zee=' + customerContactListRow.zeeID + '&custid=' + customerContactListRow.custInternalID + '&freq=daily" style="background-color:#095C7B !important;font-weight: bold; cursor: pointer !important;width: 50%;border-radius: 30px;padding: 2.5%;" class="form-control btn btn-xs btn-primary"><i class="fa-solid fa-chart-simple" style="font-size: 25px;"></i></a>'
                        }
                    }

                    var customerIDLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                        customerContactListRow.custInternalID + '&whence=" target="_blank"><b>' +
                        customerContactListRow.custEntityID + '</b></a>';
                    var contactIdLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/contact.nl?id=' +
                        customerContactListRow.contactInternalId + '&whence=" target="_blank"><b>Edit Contact</b></a>';


                    customerContactListDataSet.push([linkURL,
                        customerIDLink,
                        customerContactListRow.custName, customerContactListRow.zeeName, contactCreatedDateSplitString, contactIdLink, customerContactListRow.contactName, customerContactListRow.contactEmail, customerContactListRow.contactPhone, customerContactListRow.contactCreatePasswordEmail, customerContactListRow.contactPasswordSetupCompleted, currentStatus
                    ]);

                    csvSet.push([customerContactListRow.custInternalID,
                    customerContactListRow.custName, customerContactListRow.zeeName, contactCreatedDateSplitString, customerContactListRow.contactInternalId, customerContactListRow.contactName, customerContactListRow.contactEmail, customerContactListRow.contactPhone, customerContactListRow.contactCreatePasswordEmail, customerContactListRow.contactPasswordSetupCompleted
                    ]);
                });
            }

            var datatable = $('#mpexusage-customer_contact_list').DataTable();
            datatable.clear();
            datatable.rows.add(customerContactListDataSet);
            datatable.draw();

            saveCsv(csvSet);

            return true;
        }

        /**
         * Load the string stored in the hidden field 'custpage_table_csv'.
         * Converts it to a CSV file.
         * Creates a hidden link to download the file and triggers the click of the link.
         */
        function downloadCsv() {
            var today = new Date();
            today = formatDate(today);
            var val1 = currentRecord.get();
            var csv = val1.getValue({
                fieldId: 'custpage_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFile = new Blob([csv], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFile);
            var filename = 'Customer Cancellation List_' + today + '.csv';
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);


        }

        function getDateStoreNS() {
            var date = new Date();
            if (date.getHours() > 6) {
                date.setDate(date.getDate() + 1);
            }

            format.format({
                value: date,
                type: format.Type.DATE,
                timezone: format.Timezone.AUSTRALIA_SYDNEY
            })

            return date;
        }


        function saveRecord() {

            return true;
        }

        /**
         * Create the CSV and store it in the hidden field 'custpage_table_csv' as a string.
         * @param {Array} ordersDataSet The `billsDataSet` created in `loadDatatable()`.
         */
        function saveCsv(ordersDataSet) {
            var sep = "sep=;";
            var headers = ["Customer Internal ID", "Customer Entity ID",
                "Customer Name",
                "Franchisee", "Status", "Cancellation Requested Date",
                "Cancellation Date", "Cancellation Progress"
            ]
            headers = headers.join(';'); // .join(', ')

            var csv = sep + "\n" + headers + "\n";


            ordersDataSet.forEach(function (row) {
                row = row.join(';');
                csv += row;
                csv += "\n";
            });

            var val1 = currentRecord.get();
            val1.setValue({
                fieldId: 'custpage_table_csv',
                value: csv
            });


            return true;
        }

        function formatDate(testDate) {
            console.log('testDate: ' + testDate);
            var responseDate = format.format({
                value: testDate,
                type: format.Type.DATE
            });
            console.log('responseDate: ' + responseDate);
            return responseDate;
        }

        function replaceAll(string) {
            return string.split("/").join("-");
        }

        /**
         * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
         * @param   {String} date_iso       "2020-06-01"
         * @returns {String} date_netsuite  "1/6/2020"
         */
        function dateISOToNetsuite(date_iso) {
            var date_netsuite = '';
            if (!isNullorEmpty(date_iso)) {
                var date_utc = new Date(date_iso);
                // var date_netsuite = nlapiDateToString(date_utc);
                var date_netsuite = format.format({
                    value: date_utc,
                    type: format.Type.DATE
                });
            }
            return date_netsuite;
        }

        function GetFormattedDate(todayDate) {

            var month = pad(todayDate.getMonth() + 1);
            var day = pad(todayDate.getDate());
            var year = (todayDate.getFullYear());
            return year + "-" + month + "-" + day;
        }

        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        /**
         * [getDate description] - Get the current date
         * @return {[String]} [description] - return the string date
         */
        function getDate() {
            var date = new Date();
            date = format.format({
                value: date,
                type: format.Type.DATE,
                timezone: format.Timezone.AUSTRALIA_SYDNEY
            });

            return date;
        }

        function isNullorEmpty(val) {
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }
        return {
            pageInit: pageInit,
            saveRecord: saveRecord,
            downloadCsv: downloadCsv
        }
    });
