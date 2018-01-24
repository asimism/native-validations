/*
* Learn about Javascript Basic validation API https://www.w3schools.com/js/js_validation_api.asp
* Learn about Data attributes: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
*
* You can can custom error messages with these data attributes
* data-require-error        used to display custom message for required field
* data-pattern-error        used to display custom message for field with pattern attribute
*
* Here is a list of configuration variables that can be passed while initializing form validation
* The value for these variables will override default value if passed otherwise default value will be used.
*
* invalidEmail                      :Message that you want to display in case of invalid input
* invalidNumber                     :Message that you want to display in case of invalid input
* invalidPhone                      :Message that you want to display in case of invalid input
* invalidOption                     :Message that you want to display in case of invalid input
* invalidCheckbox                   :Message that you want to display in case of invalid input
* fillOut                           :Message that you want to display in case of invalid input
* invalidRange                      :Message that you want to display in case of invalid input
* invalidLength                     :Message that you want to display in case of invalid input
* invalidGroupOption                :Message that you want to display in case of invalid input
* messageWrapperTag                 : valid HTML element that you want to use to wrap error message
* successClass                      : class name
* errorClass                        : class name
* closestTagSelector                : any valid selector, it can be an id OR class i.e  '#form-group' OR  '.form-group'
*
 */
var EmailMessage = "Please enter a valid email address.";
var NumberMessage = "Please only enter numbers.";
var PhoneMessage = "Please enter a valid phone number.";
var OptionMessage = "Please select an option from the list.";
var CheckboxMessage = "Please check the required box.";
var FillOutMessage = "Please fill out";//field name or 'this field' will be appended to this with a space.
var RangeMessage = "Please input a value between";//field min and max attribute value will be appended to this.
var LengthMessage = "Input character should be between";//field min and max attribute value will be appended to this.
var OptionGroupMessage = "Please select at least one option";
///*{0} will be replaced with the actual message later on before displaying.*/
var MessageTag = "<span class='help-block'>{0}</span>";
var SuccessClass = "has-success";
var ErrorClass = "has-error";
var HelpBlockSelector = ".help-block";
var ClosestTagSelector = ".form-group";

var args = {
    invalidEmail: "",
    invalidNumber: "",
    invalidPhone:"",
    invalidOption:"",
    invalidCheckbox:"",
    fillOut:"",
    invalidRange:"",
    invalidLength:"",
    invalidGroupOption:"",
    successClass:"",
    errorClass:"",
    closestTagSelector:"",
    messageWrapperTag: "<span class='help-block'></span>"
};

Element.prototype.validateForm = function (args) {
    if (args !== undefined) {
        //override variable values if provided and not empty
        if (args.invalidEmail !== undefined && args.invalidEmail !== '') EmailMessage = args.invalidEmail;
        if (args.invalidNumber !== undefined && args.invalidNumber !== '') NumberMessage = args.invalidNumber;
        if (args.invalidPhone !== undefined && args.invalidPhone !== '') PhoneMessage = args.invalidPhone;
        if (args.invalidOption !== undefined && args.invalidOption !== '') OptionMessage = args.invalidOption;
        if (args.invalidCheckbox !== undefined && args.invalidCheckbox !== '') CheckboxMessage = args.invalidCheckbox;
        if (args.fillOut !== undefined && args.fillOut !== '') FillOutMessage = args.fillOut;
        if (args.invalidRange !== undefined && args.invalidRange !== '') RangeMessage = args.invalidRange;
        if (args.invalidLength !== undefined && args.invalidLength !== '') LengthMessage = args.invalidLength;
        if (args.invalidGroupOption !== undefined && args.invalidGroupOption !== '') OptionGroupMessage = args.invalidGroupOption;
        //insert {0} in between wrapper tag that will be replaced with actual message later on before displaying.
        if (args.messageWrapperTag !== undefined && args.messageWrapperTag !== '') MessageTag = args.messageWrapperTag.replace("></", ">{0}</");
        if (args.successClass !== undefined && args.successClass !== '') SuccessClass = args.successClass;
        if (args.errorClass !== undefined && args.errorClass !== '') ErrorClass = args.errorClass;
        if (args.closestTagSelector !== undefined && args.closestTagSelector !== '') ClosestTagSelector = args.closestTagSelector;
    }
    var form = this;
    this.addEventListener("invalid", function (event) {
        event.preventDefault();
    }, true);
    // Support Safari, iOS Safari, and the Android browser—each of which do not prevent
    // form submissions by default
    this.addEventListener("submit", function (event) {
        if (!this.checkValidity()) {
            event.preventDefault();
        }
    });
    //********************************************** for blur event of each control
    var allControls = this.querySelectorAll("input:not([type='submit']):not([name$='[]']), select, textarea");
    for (var i = 0; i < allControls.length; i++) {
        var input = allControls[i];
        //bind blur event for every field in the form
        input.addEventListener("blur", function (event) {
            //get parent of object
            var inputParent = event.target.parentNode;
            //Following if block is only for styled select boxes and custom date picker
            if (inputParent.classList.contains('old') || inputParent.classList.contains('date')) {
                inputParent = inputParent.closest(ClosestTagSelector)
            }

            //get help block and remove it if already added.
            var spanError = inputParent.querySelector(HelpBlockSelector);
            if (spanError) {
                inputParent.removeChild(spanError);
                inputParent.closest(ClosestTagSelector).classList.remove(ErrorClass);
                inputParent.closest(ClosestTagSelector).classList.add(SuccessClass);
            }
            //validate the current field and based on result add/remove the error message
            if (!event.target.validity.valid) {
                inputParent.closest(ClosestTagSelector).classList.add(ErrorClass);
                inputParent.closest(ClosestTagSelector).classList.remove(SuccessClass);
                inputParent.insertAdjacentHTML("beforeend", MessageTag.replace("{0}", GetMessage(event.target)));
            } else {
                inputParent.classList.remove(ErrorClass);
            }
        });
    }

    //get input type checkbox(s) that belongs to a group with name attribute
    var onlyCheckBoxGroups = this.querySelectorAll("input[name$='[]']");
    var checkBoxArray = [];
    var checkBoxNames = [];
    var singleName = '';
    //iterate checkboxes and prepare a list of group names and their relevant checkboxes
    for (var i = 0; i < onlyCheckBoxGroups.length; i++) {
        if (singleName !== onlyCheckBoxGroups[i].name) {
            if (checkBoxNames.length > 0) {
                checkBoxArray.push(checkBoxNames);
                checkBoxNames = [];
            }
            singleName = onlyCheckBoxGroups[i].name;
        }
        checkBoxNames.push(onlyCheckBoxGroups[i]);
        if ((onlyCheckBoxGroups.length - 1) === i) {
            checkBoxArray.push(checkBoxNames);
            checkBoxNames = [];
        }
    }
    for (var j = 0; j < checkBoxArray.length; j++) {
        var checkBoxes = checkBoxArray[j];
        var groupParent = checkBoxes[j].parentNode;
        //bind change and blur event foreach checkbox whose parent has attribute required
        if (groupParent.getAttribute('required') != null) {
            for (i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].addEventListener("change", function (event) {
                    checkBoxGroupValidate(event)
                });
                checkBoxes[i].addEventListener("blur", function (event) {
                    //get the next element that get focus after the recently triggered blur event
                    if (event.relatedTarget) {
                        //and if the next element is member of another group or another item then validate value
                        //for previous group
                        if (event.target.getAttribute('name') !== event.relatedTarget.getAttribute('name')) {
                            checkBoxGroupValidate(event);
                        }
                    }
                });
            }
        }
    }

    /*
    * This function validates the value for a checkbox group that is marked required.
    */
    function checkBoxGroupValidate(event) {
        //get all checked checkboxes for a group and if its null then mark it invalid or valid
        var totalChecked = event.target.parentNode.querySelector("input[name$='[]']:checked");
        if (totalChecked === null) {
            var errorMessage = '';
            if(event.target.dataset.requireError){
                errorMessage = event.target.dataset.requireError;
            }else if(event.target.parentNode.dataset.requireError){
                errorMessage = event.target.parentNode.dataset.requireError;
            }else {
                errorMessage = OptionGroupMessage;
            }
            event.target.parentNode.classList.remove(SuccessClass);
            event.target.parentNode.classList.add(ErrorClass);
            if (event.target.parentNode.querySelector(HelpBlockSelector) === null) {
                event.target.parentNode.insertAdjacentHTML("beforeend", MessageTag.replace("{0}", errorMessage));
            }
        } else {
            event.target.parentNode.classList.remove(ErrorClass);
            event.target.parentNode.classList.add(SuccessClass);
            var spanError = event.target.parentNode.querySelector(HelpBlockSelector);
            if (spanError !== null) {
                event.target.parentNode.removeChild(spanError)
            }
        }
    }

    //****************************************** for click event of submit button
    var submitButton = this.querySelector("input[type=submit]");
    submitButton.addEventListener("click", function (event) {
        var errors = 0;
        for (var j = 0; j < checkBoxArray.length; j++) {
            var checkBoxes = checkBoxArray[j];
            var groupParent = checkBoxes[j].parentNode;
            if (groupParent.getAttribute('required') != null) {
                var totalChecked = groupParent.querySelector("input[name$='[]']:checked");
                if (totalChecked === null) {
                    errors++;

                    groupParent.classList.remove(SuccessClass);
                    var errorMessage = groupParent.querySelector("input[name$='[]']").getAttribute('data-requireError');
                    groupParent.classList.add(ErrorClass);
                    if (groupParent.querySelector(HelpBlockSelector) === null) {
                        groupParent.insertAdjacentHTML("beforeend", MessageTag.replace("{0}", errorMessage));
                    }
                }
            }
        }
        var invalidFields = form.querySelectorAll(":invalid:not(fieldset)"),
            errorMessages = form.querySelectorAll(HelpBlockSelector),
            myParent;

        // Remove any existing messages
        for (var i = 0; i < errorMessages.length; i++) {
            //errorMessages[ z ].parentNode.removeChild( errorMessages[ z ] );
        }
        for (var i = 0; i < invalidFields.length; i++) {
            myParent = invalidFields[i].parentNode;
            //Following if block is only for styled select boxes
            if (myParent.classList.contains('old') || myParent.classList.contains('date')) {
                myParent = myParent.closest(ClosestTagSelector)
            }
            var spanError = myParent.querySelector(HelpBlockSelector);
            if (spanError) {
                myParent.removeChild(spanError);
                myParent.closest(ClosestTagSelector).classList.remove(ErrorClass);
            }
            if (!invalidFields[i].validity.valid) {
                myParent.closest(ClosestTagSelector).classList.add(ErrorClass);
                myParent.insertAdjacentHTML("beforeend", MessageTag.replace("{0}", GetMessage(invalidFields[i])));
            } else {
                myParent.closest(ClosestTagSelector).classList.remove(ErrorClass);
            }
        }

        // If there are errors, give focus to the first invalid field
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
        } else {
            if (errorMessages.length === 0) {
                this.submit();
            } else {
                event.preventDefault();
            }
        }
    });
};

/**
 * @return {string}
 */
function GetMessage(element) {
    //the data attribute with multiple dashes(-) will be obtained using camelCase conversion i.e data-abc-def corresponds to the key abcDef
    //If data-requireError or data-patternError are defined
    if (element.dataset.requireError || element.dataset.patternError) {
        if (element.validity.valueMissing === true) {
            return element.dataset.requireError;
        }
        else {
            return element.dataset.patternError;
        }
    } else {
        //if error message are not defined via data attributes then use default OR generic messages.
        var name = element.nodeName,
            type = element.type;
        //assign name to type variable if element is not an input element to use within switch case
        if (name !== 'INPUT') {
            type = name;
        }
        var errorMessageToShow = '';
        switch (type) {
            case 'email':
                if (element.validity.typeMismatch === true) {
                    errorMessageToShow = EmailMessage;
                } else {
                    errorMessageToShow = element.validationMessage;
                }
                break;
            case 'tel':
                if (element.validity.typeMismatch === true) {
                    errorMessageToShow = PhoneMessage;
                } else {
                    errorMessageToShow = element.validationMessage;
                }
                break;
            case 'SELECT':
            case 'radio':
                if (element.validity.valueMissing === true) {
                    errorMessageToShow = OptionMessage;
                }
                else {
                    errorMessageToShow = element.validationMessage;
                }
                break;
            case 'checkbox':
                if (element.validity.valueMissing === true) {
                    errorMessageToShow = CheckboxMessage;
                } else {
                    errorMessageToShow = element.validationMessage;
                }
                break;
            default:
                if (element.validity.valueMissing === true) {
                    /* Required field left blank. */
                    errorMessageToShow = FillOutMessage + ((element.name) ? (' ' + element.name + '.') : ' this field.');
                } else if (element.validity.typeMismatch === true) {
                    /* element's value is invalid per its type attribute */
                    errorMessageToShow = element.validationMessage;
                } else if (element.validity.patternMismatch === true) {
                    /* element's value does not match its pattern attribute */
                    if (element.pattern === '\\d*') {
                        errorMessageToShow = NumberMessage;
                    } else {
                        errorMessageToShow = element.validationMessage;
                    }
                } else if (element.validity.rangeOverflow === true || element.validity.rangeUnderflow === true) {
                    /*element's value does not match its min/max attribute*/
                    var max = element.getAttribute('max'),
                        min = element.getAttribute('min');
                    errorMessageToShow = RangeMessage + " " + min + "-" + max + ".";
                } else if (element.validity.tooLong === true || element.validity.tooShort === true) {
                    //element's value not match with minimum/maximum length attribute
                    var maxLength = element.getAttribute('maxlength'),
                        minLength = element.getAttribute('minlength');
                    errorMessageToShow = LengthMessage + " " + minLength + "-" + maxLength + ".";
                } else if (element.validity.stepMismatch === true) {
                    errorMessageToShow = element.validationMessage;
                } else {
                    /* Default message. */
                    errorMessageToShow = element.validationMessage;
                }
                break;
        }
        return errorMessageToShow;
    }
}