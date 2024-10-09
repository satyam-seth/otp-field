import OTPField from './components/field';

window.onload = () => {
  // create otp field instance
  const otpField = new OTPField({
    namespace: 'example',
    boxCount: 6,
  });

  // TODO: add for to get config and add button to show current value 

  // build otp field
  otpField.build(document.body);
};
