/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * Author:               Ankith Ravindran
 * Created on:           Fri Jun 28 2024
 * Modified on:          Fri Jun 28 2024 11:22:54
 * SuiteScript Version:  2.0 
 * Description:          Ability to unsubscribe a contact from receiving future EDM emails 
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
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

            if (context.request.method === 'GET') {

                log.debug({
                    title: 'context.request.parameters',
                    details: context.request.parameters
                })

                var custinternalid = context.request.parameters.custinternalid;
                var contactid = context.request.parameters.contactid;


                var form = ui.createForm({
                    title: 'You have successfully opted out.'
                });

                var contactRecord = record.load({
                    type: record.Type.CONTACT,
                    id: parseInt(contactid),
                    isDynamic: true
                });

                contactRecord.setValue({
                    fieldId: 'custentity_subscribe_list',
                    value: 2
                });

                contactRecord.save();

                context.response.writePage(form);
            } else {

            }
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
