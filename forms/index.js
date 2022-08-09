// import in caolan forms
const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        cost: fields.string({
            label: 'Cost (SGD)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        weight: fields.string({
            label: 'Weight (g)',
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        length: fields.string({
            label: 'Length (mm)',
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        width: fields.string({
            label: 'Width (mm)',
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        height: fields.string({
            label: 'Height (mm)',
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        stock: fields.string({
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        })
    })
};

module.exports = { createProductForm, bootstrapField };