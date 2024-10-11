import OTPField from './components/field';
// import Logger from './utils/logger';

window.onload = () => {
  // Logger.instance.setLevel('warn');

  // create otp field instance
  const otpField = new OTPField({
    namespace: 'example',
    boxCount: 6,
    onPasteBlur: false,
  });

  // TODO: add for to get config and add button to show current value

  // build otp field
  otpField.build(document.body);
};
