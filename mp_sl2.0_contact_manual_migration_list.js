/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * Author:               Ankith Ravindran
 * Created on:           Fri May 30 2023
 * Modified on:          Wed May 31 2023 14:23:11
 * SuiteScript Version:  2.0
 * Description:          List the contacts that has been registered via the webform to get access to the customer portal.
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect', 'N/url', 'N/format', 'N/task'],
    function (ui, email, runtime, search, record, https, log, redirect, url, format, task) {
        var role = 0;
        var userId = 0;
        var zee = 0;

        function onRequest(context) {
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            userId = runtime.getCurrentUser().id;

            role = runtime.getCurrentUser().role;
            var paramAccountActivated = 2;
            var paramCustomerType = 1;

            var paramInitialDisplay = null;
            var paramFinalDisplay = null;



            if (context.request.method === 'GET') {

                var start_date = context.request.parameters.start_date;
                var last_date = context.request.parameters.last_date;
                zee = context.request.parameters.zee;
                var paramUserId = context.request.parameters.user;
                paramAccountActivated = context.request.parameters.activated;
                paramCustomerType = context.request.parameters.type;


                paramInitialDisplay = context.request.parameters.intial;
                paramFinalDisplay = context.request.parameters.final;

                log.debug({
                    title: 'paramInitialDisplay',
                    details: paramInitialDisplay
                });

                log.debug({
                    title: 'paramFinalDisplay',
                    details: paramFinalDisplay
                });

                if (isNullorEmpty(paramInitialDisplay)) {
                    paramInitialDisplay = null;
                }

                if (isNullorEmpty(paramFinalDisplay)) {
                    paramFinalDisplay = null;
                }

                log.debug({
                    title: 'paramInitialDisplay',
                    details: paramInitialDisplay
                });

                log.debug({
                    title: 'paramFinalDisplay',
                    details: paramFinalDisplay
                });

                if (isNullorEmpty(paramCustomerType)) {
                    paramCustomerType = 2;
                }
                if (isNullorEmpty(paramAccountActivated)) {
                    paramAccountActivated = 2;
                }
                if (isNullorEmpty(start_date)) {
                    start_date = null;
                }

                if (isNullorEmpty(last_date)) {
                    last_date = null;
                }

                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                if (isNullorEmpty(paramUserId)) {
                    paramUserId = null;
                } else {
                    userId = paramUserId;
                }

                var form = ui.createForm({
                    title: 'Customer Contacts - Manual Migration'
                });


                var inlineHtml =
                    '<script src="https://kit.fontawesome.com/caf4687b4b.js" crossorigin="anonymous"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.trending {animation: trending 2s infinite cubic-bezier(0.99, -0.1, 0.01, 1.02); stroke-dashoffset: 100;stroke-dasharray: 100;}@keyframes trending {100% {stroke-dashoffset: 0;}}.tooltip .tooltiptext{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;border-radius:6px;padding:5px 0;position:absolute;z-index:1}.tooltip:hover .tooltiptext{visibility:visible}.tooltip .tooltiptext::after {content: " ";position: absolute;top: 100%; /* At the bottom of the tooltip */left: 50%;margin-left: -5px;border-width: 5px;border-style: solid;border-color: black transparent transparent transparent;}.button-shadow{box-shadow:2.5px 2.8px 4.1px rgba(0,0,0,.2),20px 22px 33px rgba(0,0,0,.4)}button{font-family:inherit;background: transparent;color:#095C7B;padding:.7em 1em .7em .9em;display:inline-flex;align-items:center;border:none;border-radius:16px;overflow:hidden;transition:.2s}button span{display:block;margin-left:.3em;transition:.3s ease-in-out}button svg{display:block;transform-origin:center center;transition:transform .3s ease-in-out}button:hover .svg-wrapper{animation:.6s ease-in-out infinite alternate fly-1}button:hover svg{transform:translateX(1.2em) rotate(45deg) scale(1.1)}button:hover span{transform:translateX(5em)}button:active{transform:scale(.95)}@keyframes fly-1{from{transform:translateY(.1em)}to{transform:translateY(-.1em)}}</style > ';

                form.addField({
                    id: 'custpage_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_customer_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_sales_rep_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = paramUserId;

                form.addField({
                    id: 'custpage_contact_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_contact_fname',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_contact_lname',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_contact_email',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_contact_phone',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_salesrecordid',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_lostnoresponse',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_initialdisplaylist',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = paramInitialDisplay

                form.addField({
                    id: 'custpage_displaylist',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = paramFinalDisplay

                form.addField({
                    id: 'custpage_totalcontactlist',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                //Loading Section that gets displayed when the page is being loaded
                inlineHtml += loadingSection();
                if (role == 3 || role == 1032) {
                    inlineHtml += '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Action Buttons</u></b><ol><li><b>CREATE PASSWORD EMAIL SENT</b>: Click button when create password email has been sent to the contact.</li><li><b>ACCOUNT ACTIVATED</b>: Click button when the contact has created the password and account has been activated. </li><li><b>RESEND</b>: Click button to resend the Create Password email. </li></ol></p><p>Customer receives reminder email every Tuesday & Thursday for 2 weeks if the account has not been activated.</br></br><b><u>USAGE SOURCE STATUS</u></b> <i style="color: #ff9090;font-weight: bold;">(Based on contact created date)</i><ol><li><b>EMPTY</b>: No Account has been created.</li><li><b>NO USAGE</b>: No usage from the time the contact has been created.</li><li><b>DIGITAL LABEL</b>: Manual Barcodes have not been used from the time the contact has been created. </li><li><b>MANUAL BARCODES</b>: Manual Barcodes have been used from the time the contact has been created. </li></ol></p></div></br>'
                } else {
                    inlineHtml += '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p>Customer receives reminder email every Tuesday & Thursday for 2 weeks if the account has not been activated.</br></br><b><u>USAGE SOURCE STATUS</u></b> <i style="color: #ff9090;font-weight: bold;">(Based on contact created date)</i><ol><li><b>EMPTY</b>: No Account has been created.</li><li><b>NO USAGE</b>: No usage from the time the contact has been created.</li><li><b>DIGITAL LABEL</b>: Manual Barcodes have not been used from the time the contact has been created. </li><li><b>MANUAL BARCODES</b>: Manual Barcodes have been used from the time the contact has been created. </li></ol></p></div></br>'
                }

                //Search: SMC - Franchisees
                var searchZees = search.load({
                    id: 'customsearch_smc_franchisee'
                });
                var resultSetZees = searchZees.run();

                inlineHtml += '<div id="container">'
                inlineHtml += typeOfCustomer(paramCustomerType);
                inlineHtml += accountActivatedDropdownSection(paramAccountActivated);
                inlineHtml += displayList();
                inlineHtml += franchiseeDropdownSection(resultSetZees, context);


                inlineHtml +=
                    '<div class="form-group container filter_buttons_section hide">';
                inlineHtml += '<div class="row">';
                inlineHtml +=
                    '<div class="col-xs-2"></div>'
                inlineHtml +=
                    '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary button-shadow" id="applyFilter" style="background-color: #095C7B;" /></div>'
                inlineHtml +=
                    '<div class="col-xs-4"><input type="button" value="CLEAR FILTER" class="form-control btn btn-primary button-shadow" id="clearFilter" style="background-color: #F0AECB; color: #103d39;" /></div>'
                inlineHtml +=
                    '<div class="col-xs-2"></div>'

                inlineHtml += '</div>';
                inlineHtml += '</div></br></br>';

                // Tabs headers
                inlineHtml +=
                    '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095c7b; color: #fff }';
                inlineHtml +=
                    '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095c7b; color: #095c7b; border-radius: 30px;}';
                inlineHtml += '</style>';

                inlineHtml +=
                    '<div class="tabs_div hide" style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';
                if (paramCustomerType == 1) {
                    inlineHtml +=
                        '<li role="presentation" class="active"><a data-toggle="tab" href="#top50"><b>TOP 50</b></a></li>';

                    inlineHtml +=
                        '<li role="presentation" class="hide"><a data-toggle="tab" href="#remaing"><b>REMAINING</b></a></li>';
                } else {
                    inlineHtml +=
                        '<li role="presentation" class="hide"><a data-toggle="tab" href="#top50"><b>TOP 50</b></a></li>';

                    inlineHtml +=
                        '<li role="presentation" class="active"><a data-toggle="tab" href="#remaing"><b>REMAINING</b></a></li>';
                }


                inlineHtml += '</ul></div>';

                if (paramCustomerType == 1) {
                    // Tabs content
                    inlineHtml += '<div class="tab-content">';
                    inlineHtml += '<div role="tabpanel" class="tab-pane active" id="top50">';
                    inlineHtml += '<div class="form-group container paramAccountActivated_section hide">';
                    inlineHtml += '<div class="row">';
                    inlineHtml += '<div class="col-xs-4 paramAccountActivated_dropdown_div"></div>';
                    inlineHtml += '<div class="col-xs-4 paramAccountActivated_dropdown_div">';
                    // inlineHtml += '';
                    // inlineHtml +=
                    //     ';
                    inlineHtml += '<div class="input-group"><span style="background-color:#F0AECB;color:#085c7b;font-weight:700" class="input-group-addon btn btn-primary displayDecrement">Prev</span><span class="input-group-addon" id="account_activated_text">Contacts Displayed</span><input type="text" class="form-control" id="displayContacts" value="" readonly style="text-align: center;"/><span style="background-color:#085c7b;color:#fff;font-weight:700;text-align:center;" class="input-group-addon btn btn-primary displayIncrement">Next</span></div></div></div>';
                    // inlineHtml += '<input type="button" class="form-control btn btn-primary col-xs-2" value="-" /><div class="input-group"><span class="input-group-addon" id="account_activated_text">Contacts Displayed</span><input type="text" class="form-control" id="displayContacts" value="" readonly /></div><input type="button" class="form-control btn btn-primary col-xs-2" value="+" />'
                    inlineHtml += '<div class="col-xs-4 paramAccountActivated_dropdown_div"></div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div></div></br>';
                    inlineHtml += '<div class="form-group container customerCountDiv hide">';
                    inlineHtml += '<div class="row">';
                    inlineHtml += '<div class="col-xs-4 ">';
                    inlineHtml += '<div class="input-group"><span class="input-group-addon" id="account_activated_text">No Usage Count</span><input type="text" class="form-control" id="noUsageCount" value="" readonly style="text-align: center;"/></div></div>';
                    inlineHtml += '<div class="col-xs-4 ">';
                    inlineHtml += '<div class="input-group"><span class="input-group-addon" id="account_activated_text">Manual Usage Count</span><input type="text" class="form-control" id="manualUsageCount" value="" readonly style="text-align: center;"/></div></div>';
                    inlineHtml += '<div class="col-xs-4 ">';
                    inlineHtml += '<div class="input-group"><span class="input-group-addon" id="account_activated_text">Digital Usage Count</span><input type="text" class="form-control" id="digitalUsageCount" value="" readonly style="text-align: center;"/></div></div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div></div></br></br>';
                    inlineHtml += dataTable('customer_contact_list');
                    inlineHtml += '</div>';

                    inlineHtml += '<div role="tabpanel" class="tab-pane" id="remaing">';

                    inlineHtml += dataTable('customer_contact_list_remaining');
                    inlineHtml += '</div>';

                    inlineHtml += '</div></div>';
                } else {
                    // Tabs content
                    inlineHtml += '<div class="tab-content">';
                    inlineHtml += '<div role="tabpanel" class="tab-pane " id="top50">';
                    inlineHtml += dataTable('customer_contact_list');
                    inlineHtml += '</div>';

                    inlineHtml += '<div role="tabpanel" class="tab-pane active" id="remaing">';
                    inlineHtml += '<div class="form-group container paramAccountActivated_section hide">';
                    inlineHtml += '<div class="row">';
                    inlineHtml += '<div class="col-xs-4 paramAccountActivated_dropdown_div"></div>';
                    inlineHtml += '<div class="col-xs-4 paramAccountActivated_dropdown_div">';
                    // inlineHtml += '';
                    // inlineHtml +=
                    //     ';
                    inlineHtml += '<div class="input-group"><span style="background-color:#F0AECB;color:#085c7b;font-weight:700" class="input-group-addon btn btn-primary displayDecrement">Prev</span><span class="input-group-addon" id="account_activated_text">Contacts Displayed</span><input type="text" class="form-control" id="displayContacts" value="" readonly style="text-align: center;"/><span style="background-color:#085c7b;color:#fff;font-weight:700;text-align:center;" class="input-group-addon btn btn-primary displayIncrement">Next</span></div></div></div>';
                    // inlineHtml += '<input type="button" class="form-control btn btn-primary col-xs-2" value="-" /><div class="input-group"><span class="input-group-addon" id="account_activated_text">Contacts Displayed</span><input type="text" class="form-control" id="displayContacts" value="" readonly /></div><input type="button" class="form-control btn btn-primary col-xs-2" value="+" />'
                    inlineHtml += '<div class="col-xs-4 paramAccountActivated_dropdown_div"></div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div></div></br>';

                    inlineHtml += '<div class="form-group container customerCountDiv hide">';
                    inlineHtml += '<div class="row">';
                    inlineHtml += '<div class="col-xs-4 ">';
                    inlineHtml += '<div class="input-group"><span class="input-group-addon" id="account_activated_text">No Usage Count</span><input type="text" class="form-control" id="noUsageCount" value="" readonly style="text-align: center;"/></div></div>';
                    inlineHtml += '<div class="col-xs-4 ">';
                    inlineHtml += '<div class="input-group"><span class="input-group-addon" id="account_activated_text">Manual Usage Count</span><input type="text" class="form-control" id="manualUsageCount" value="" readonly style="text-align: center;"/></div></div>';
                    inlineHtml += '<div class="col-xs-4 ">';
                    inlineHtml += '<div class="input-group"><span class="input-group-addon" id="account_activated_text">Digital Usage Count</span><input type="text" class="form-control" id="digitalUsageCount" value="" readonly style="text-align: center;"/></div></div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div>';
                    inlineHtml += '</div></div></br></br>';

                    inlineHtml += dataTable('customer_contact_list_remaining');
                    inlineHtml += '</div>';

                    inlineHtml += '</div></div>';
                }


                inlineHtml += '</div>';

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;

                form.addSubmitButton({ label: '' });

                form.clientScriptFileId = 6393001;

                context.response.writePage(form);
            } else {
                var customer_id = context.request.parameters.custpage_customer_id;
                var sales_rep_id = context.request.parameters.custpage_sales_rep_id;
                var contact_id = context.request.parameters.custpage_contact_id;
                var contact_fname = context.request.parameters.custpage_contact_fname;
                var contact_lname = context.request.parameters.custpage_contact_lname;
                var contact_email = context.request.parameters.custpage_contact_email;
                var contact_phone = context.request.parameters.custpage_contact_phone;
                var custpage_salesrecordid = context.request.parameters.custpage_salesrecordid;

                log.debug({
                    title: 'customer_id',
                    details: customer_id
                });

                log.debug({
                    title: 'contact_fname',
                    details: contact_fname
                });

                log.debug({
                    title: 'contact_lname',
                    details: contact_lname
                });

                log.debug({
                    title: 'contact_email',
                    details: contact_email
                });

                log.debug({
                    title: 'contact_phone',
                    details: contact_phone
                });



                params = {
                    custscript_cust_internal_id: customer_id,
                    custscript_contact_internal_id: contact_id,
                    custscript_contact_fname: contact_fname,
                    custscript_conatct_lname: contact_lname,
                    custscript_contact_email: contact_email,
                    custscript_contact_phone: contact_phone
                };
                var reschedule = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: 'customscript_ss_send_portal_password_ema',
                    deploymentId: 'customdeploy1',
                    params: params
                });

                var reschedule_id = reschedule.submit();

                redirect.toSuitelet({
                    scriptId: 'customscript_sl2_contact_manual_migratio',
                    deploymentId: 'customdeploy1',
                    parameters: {}
                });


            }
        }

        /**
 * The Franchisee dropdown field.
 * @param   {zeeSearchResult}    resultSetZees
 * @return  {String}    `inlineHtml`
 */
        function franchiseeDropdownSection(resultSetZees, context) {
            var inlineHtml =
                '<div class="form-group container zee_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">FRANCHISEE</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container zee_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 zee_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="zee_dropdown_text">Franchisee</span>';
            inlineHtml += '<select id="zee_dropdown" class="form-control">';
            inlineHtml += '<option value=""></option>'
            resultSetZees.each(function (searchResult_zee) {
                zee_id = searchResult_zee.getValue('internalid');
                zee_name = searchResult_zee.getValue('companyname');

                if (zee == zee_id) {
                    inlineHtml += '<option value="' + zee_id +
                        '" selected="selected">' + zee_name + '</option>';
                } else {
                    inlineHtml += '<option value="' + zee_id + '">' + zee_name +
                        '</option>';
                }

                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;

        }

        function accountActivatedDropdownSection(paramAccountActivated) {
            var inlineHtml =
                '<div class="form-group container paramAccountActivated_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">ACCOUNT ACTIVATED</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container paramAccountActivated_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 paramAccountActivated_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="account_activated_text">Account Activated</span>';
            inlineHtml += '<select id="paramAccountActivated_dropdown" class="form-control">';
            if (paramAccountActivated == 1) {
                inlineHtml += '<option value=""></option>'
                inlineHtml += '<option value="1" selected>YES</option>'
                inlineHtml += '<option value="2" >NO</option>'
            } else {
                inlineHtml += '<option value=""></option>'
                inlineHtml += '<option value="1">YES</option>'
                inlineHtml += '<option value="2" selected>NO</option>'
            }


            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;
        }

        function typeOfCustomer(paramCustomerType) {
            var inlineHtml =
                '<div class="form-group container paramAccountActivated_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">MANUAL CUSTOMER TYPE</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container paramAccountActivated_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 paramAccountActivated_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="account_activated_text">Customer Profile</span>';
            inlineHtml += '<select id="typeOfCustomer_dropdown" class="form-control">';
            if (paramCustomerType == 1) {
                inlineHtml += '<option value=""></option>'
                inlineHtml += '<option value="1" selected>TOP 50</option>'
                inlineHtml += '<option value="2" >REMAINING</option>'
            } else {
                inlineHtml += '<option value=""></option>'
                inlineHtml += '<option value="1">TOP 50</option>'
                inlineHtml += '<option value="2" selected>REMAINING</option>'
            }


            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;
        }

        function displayList() {

            var inlineHtml =
                '<div class="form-group container paramAccountActivated_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">NUMBER OF CONTACTS</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container paramAccountActivated_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 paramAccountActivated_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="account_activated_text">Total Contacts</span>';
            inlineHtml += '<input type="text" class="form-control" id="totalDisplayContacts" value="" readonly style="text-align: center;"/>'
            inlineHtml += '</div></div>';
            // inlineHtml += '<div class="col-xs-2 paramAccountActivated_dropdown_div">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml += '<button class="form-control btn btn-primary" onclick="">Prev</button>';
            // inlineHtml += '</div></div>';
            // inlineHtml += '<div class="col-xs-6 paramAccountActivated_dropdown_div">';
            // inlineHtml += '';
            // inlineHtml +=
            //     ';
            // inlineHtml += '<div><div class="pull-left"><button type="button" class="btn btn-primary displayDecrement">Prev</button></div><div><div class="input-group"><span class="input-group-addon" id="account_activated_text">Contacts Displayed</span><input type="text" class="form-control" id="displayContacts" value="" readonly /><span class="input-group-addon btn btn-primary displayIncrement">Next</span></div></div></div>';
            // inlineHtml += '<input type="button" class="form-control btn btn-primary col-xs-2" value="-" /><div class="input-group"><span class="input-group-addon" id="account_activated_text">Contacts Displayed</span><input type="text" class="form-control" id="displayContacts" value="" readonly /></div><input type="button" class="form-control btn btn-primary col-xs-2" value="+" />'
            // inlineHtml += '</div>';
            // inlineHtml += '</div>';
            // inlineHtml += '<div class="col-xs-2 paramAccountActivated_dropdown_div">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml += '<button class="form-control btn btn-primary" onclick="">Next</button>';
            // inlineHtml += '</div></div>';
            inlineHtml += '</div></div>';




            return inlineHtml;
        }

        /**
         * The table that will display the differents invoices linked to the
         * franchisee and the time period.
         *
         * @return {String} inlineHtml
         */
        function dataTable(name) {
            var inlineHtml = '<style>table#mpexusage-' +
                name +
                ' {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#mpexusage-' +
                name +
                ' th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;}table#mpexusage-' +
                name +
                ' td{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} </style>';
            inlineHtml += '<div class="table_section hide"><table id="mpexusage-' +
                name +
                '" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
            inlineHtml += '<tr class="text-center">';

            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

            inlineHtml += '</table></div>';
            return inlineHtml;
        }

        function userDropdownSection(userId) {

            var searchedSalesTeam = search.load({
                id: 'customsearch_active_employees_3'
            });

            var inlineHtml =
                '<div class="form-group container cust_filter_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">SALES REP</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container cust_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 cust_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="user_dropdown_text">Sales Rep</span>';
            inlineHtml += '<select id="user_dropdown" class="form-control">';
            inlineHtml += '<option value=""></option>'
            searchedSalesTeam.run().each(function (searchResult_sales) {
                employee_id = searchResult_sales.getValue({
                    name: 'internalid'
                });
                employee_name = searchResult_sales.getValue({
                    name: 'entityid'
                });

                if (userId == employee_id) {
                    inlineHtml += '<option value="' + employee_id +
                        '" selected="selected">' + employee_name + '</option>';
                } else {
                    inlineHtml += '<option value="' + employee_id + '">' +
                        employee_name +
                        '</option>';
                }

                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container zee_available_buttons_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-4"></div>'
            inlineHtml +=
                '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" /></div>'
            inlineHtml +=
                '<div class="col-xs-4"></div>'
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            return inlineHtml;

        }

        /**
         * The header showing that the results are loading.
         * @returns {String} `inlineQty`
         */
        function loadingSection() {
            var inlineHtml = '<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 ">';
            inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
            inlineHtml += '</div></div></div></br></br>';
            inlineHtml += '<div class="wrapper loading_section">';
            inlineHtml += '<div class="blue ball"></div>'
            inlineHtml += '<div class="red ball"></div>'
            inlineHtml += '<div class="yellow ball"></div>'
            inlineHtml += '<div class="green ball"></div>'

            inlineHtml += '</div>'

            return inlineHtml;
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

        function isNullorEmpty(val) {
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }
        return {
            onRequest: onRequest
        };
    });
