#Admin Panel boilerplate by React Js
This project is an open source admin panel that you can use for your projects easily. Everything has been prepared for you, so you just define models (JSON files) for each entity and everything will be ready out of the box.
##Main features
- Multilingual
- Multi-Direction (LTR / RTL)
- Multi-Calendar support (Gregorian / Jalali)
##Installation
After cloning, create a .env file from .env.sample and fill it by appropriate values, then run

`npm install`

and

`npm start`

That's it!
##Model structure
A model is a JSON file in src/models directory and consists of these parts:

`{base, list, item}`

- `base` provides basic information and fields and types of the model.
- `list` provides fields and operations to show in the list page of that model.
- `item` provides fields of the model to show in add or edit page.

let's dive into the features.
##Field types
In the base.model you define fields and can provide type of each field that can be:
- Without type: provides a simple value in list page and an input box in item page
- `image`: shows the image thumbnail in list page that you can click on to see the full size, and provide an image cropper in item page.
- `images`: like the image field but shows and accepts more than one image
- `select`: shows the corresponding value in the list page and a drop down list in item page
- `date`: converts value to the specified locale date system in list page, and provides a date picker in item page
- `time`: shows the time part of the value
- `timeago`: shows the relative time from now
- `formatted_number`: formats the number value by grouping each 3 digits by comma
- `checkbox`: show a check mark if the value is true in list page, and a checkbox in item page
- `password`: provides a password field in item page 

These types can be used in list.fields array:
- `multiple`: you can show more than one field in a cell by this type
- `nested`: show the value of a multilevel json (eg: user.name)
- `function`: you can write a custom function and pass some values to show anything you want in the cell
- `static`: a static value
- `social`: get the username and show the icon and link to that social account

These types can be used in item.fields array:
- `textarea`: provides a textarea instead of a text input
- `hidden`: provides a hidden input
- `map`: provides a Google map to select a position
- `picker`: provides a button to pick an entity from the list

##Other attributes
You can set some attributes other than type for a field.
- `max_length`: crops the long texts in list page
- `style`: write custom extra style for the field
- `rows`: rows for the textarea field
- `width` & `height`: attributes for the image fields

##Search
You can provide search by different fields in your list page. To do so you may just add search to the list part of the model.
Simple usage of a search fields is `{name: "title"}`: search by title (wildcard)

A search field may have `search_type` with following values:
- `exact`: search the exact phrase
- `regex`: search values that contain the phrase, you can add `regex_type: "start"` to search for the values starting by the phrase
- `gte`: search for greater or equal values
- `lte`: search for lower or equal values

A search field may also have `field_type` with the following values:
- `between`: search for values between two phrases
- `between_dates`: search for values between two dates
- `select`: search by drop down list
- `select_search`: search by autocomplete drop down list
- `checkbox`: search by true or false checkbox
- `picker`: search by value picked from an entity picker

##Confirmation
Some entities should be confirmed or rejected in list page. You can specify these fields in base part of model:
- `confirm_field`: specifies the name of confirm field that should be true or false
- `confirm_extra_fields`: fields that should be changed to true or false besides the confirm field
- `confirm_other_fields`: fields that should pass to the API with their value

After specifying confirm field, you should add `confirm` to the operations of the list:

`operations: ["add", "edit", "remove", "confirm"]`

##Export data
You can add an Export button and export current showing data to an Excel file by adding `export_fields` to the list part. It's an array of fields like list.fields that specifies fields to export. 

##Custom operations
You can add custom operation buttons by `custom_operations` array in list part. Each custom operation has the following properties:
- `className`: primary / default / danger / info / warning
- `caption`: simple text or icon (`{icon: "MailIcon"}`)
- `click: {func: props.function.TestFunc, params: ['id', 'title']}`: action function

##Picker
Each entity can be used as a picker. For example you can make a User Picker, to do so you may just add a `picker` field to the base part of the users model.
It consists of these fields:
- `params`: an array of fields to retrieve
- `caption`: caption of picker after picking one row
- `fields`: an array of fields to show in the picker modal

##Usage
Take a look at src/models directory and you can find usage of these features in action.

##Author
Alireza Nasseh

alireza.nasseh@gmail.com