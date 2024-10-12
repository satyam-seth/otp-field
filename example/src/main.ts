import { OTPField } from '@satyam-seth/otp-field';

window.onload = () => {
  // create otp field instance
  const otpField = new OTPField({
    namespace: 'example',
    boxCount: 3,
  });

  // TODO: add for to get config and add button to show current value

  // build otp field
  otpField.build(document.body);
};
