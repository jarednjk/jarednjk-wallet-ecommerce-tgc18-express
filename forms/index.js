// import in caolan forms
const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control my-1');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group my-3">' + label + widget + error + '</div>';
};

const createProductForm = (materials, brands, categories, features) => {
    return forms.create({
        name: fields.string({
            label: 'Name:',
            required: true,
            errorAfterField: true,
        }),
        cost: fields.string({
            label: 'Cost (SGD):',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        description: fields.string({
            label: 'Description:',
            required: true,
            errorAfterField: true,
        }),
        length: fields.string({
            label: 'Length (mm):',
            required: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        width: fields.string({
            label: 'Width (mm):',
            required: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        height: fields.string({
            label: 'Height (mm):',
            required: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        card_slot: fields.string({
            label: 'Card Slot:',
            required: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        material_id: fields.string({
            label: 'Material:',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: materials
        }),
        brand_id: fields.string({
            label: 'Brand:',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands
        }),
        category_id: fields.string({
            label: 'Category:',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: categories
        }),
        features: fields.string({
            label: 'Features:',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: features
        })
    })
};

const createVariantForm = (colors) => {
    return forms.create({
        color_id: fields.string({
            label: 'Color:',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: colors
        }),
        stock: fields.string({
            label: 'Stock:',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        image_url: fields.string({
            widget: widgets.hidden()
        }),
        thumbnail_url: fields.string({
            widget: widgets.hidden()
        }),
    })
}

const createRegistrationForm = () => {
    return forms.create({
        first_name: fields.string({
            required: true,
            errorAfterField: true,
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true,
        }),
        email: fields.string({
            required: true,
            errorAfterField: true,
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        }),
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        })
    })
}

const createSearchForm = (materials, brands, categories, features) => {
    return forms.create({
        name: fields.string({
            label: 'Name',
            required: false,
            errorAfterField: true,
        }),
        'min_cost': fields.string({
            required: false,
            errorAfterField: true,
            'validators': [validators.integer()]
        }),
        'max_cost': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'min_card_slot': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'max_card_slot': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        material_id: fields.string({
            label: 'Material',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: materials
        }),
        brand_id: fields.string({
            label: 'Brand',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands
        }),
        category_id: fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: categories
        }),
        features: fields.string({
            label: 'Features',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: features
        })
    })
};

const createOrderSearchForm = (statuses) => {
    return forms.create({
        order_id: fields.string({
            label: 'Order ID',
            required: false,
            errorAfterField: true
        }),
        status_id: fields.string({
            label: 'Status',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: statuses
        }),
        order_date: fields.date({
            required: false,
            errorAfterField: true,
            widget: widgets.date()
        })
    })
}

const createOrderStatusForm = (statuses) => {
    return forms.create({
        status_id: fields.string({
            label: 'Order Status',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: statuses
        })
    })
}

module.exports = {
    createOrderSearchForm,
    createOrderStatusForm,
    createProductForm,
    createRegistrationForm,
    createLoginForm,
    createVariantForm,
    createSearchForm,
    bootstrapField
};