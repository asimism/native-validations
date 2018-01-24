# native-validations
A javascript library to interecpt html5 validations. Main focus of this library is to only use html5 native validations and able to intercept the default messages and replace them with custom messages. Additionally to have the ability to add css classes in html control's wrapper element to assist in writing CSS hooks for validation messages
# how to write error messages in the html input itself
Please write two data attributes for two types of validations
For Required Field Error use following : 
data-require-error="Name is required"
For pattern mismatch Error use following:
data-pattern-error="Username should be lower case upto 15 characters"
# How to bind
document.getElementById('valForm').validateForm({optional cofigurations Array});
# Configuration object
configuration object can be used to:
- to bind error messages to particular control types
- to specify error and sucess classes
- css hook to element's wrapper 
Plesae read comments at the top of ~/js/form-validation.js file
# Note
This library is still work in progress so errors and omissions are expected.
