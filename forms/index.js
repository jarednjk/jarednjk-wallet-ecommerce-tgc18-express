// import in caolan forms
const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

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

const createProductForm = (materials, brands) => {
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
        card_slot: fields.string({
            label: 'Card Slot',
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        coin_pocket: fields.string({
            label: 'Coin Pocket',
            required: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        stock: fields.string({
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        material_id: fields.string({
            label: 'Material',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: materials
        }),
        brand_id: fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: brands
        })
    })
};

module.exports = { createProductForm, bootstrapField };