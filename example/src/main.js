"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var otp_field_1 = require("@satyam-seth/otp-field");
window.onload = function () {
    // create otp field instance
    var otpField = new otp_field_1.OTPField({
        namespace: 'example',
        boxCount: 3,
    });
    // TODO: add for to get config and add button to show current value
    // build otp field
    otpField.build(document.body);
};
