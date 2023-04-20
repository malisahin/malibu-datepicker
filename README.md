# Malibu Datepicker

Malibu Datepicker is a lightweight, customizable datepicker plugin for web applications. It's built with JavaScript and jQuery.

## Features

- Lightweight and customizable
- Supports various date formats
- Configurable options
- Easy to use

## Installation

To use Malibu Datepicker in your project, simply include the following files in your HTML file:

```html
<link rel="stylesheet" href="malibu-datepicker.css">
<script src="jquery.js"></script>
<script src="malibu-datepicker.js"></script>
```

Alternatively, you can install Malibu Datepicker via npm:


```shell
npm install malibu-datepicker
```


## Usage

You can initialize Malibu Datepicker on an input element like this:

```javascript
$("#datepicker").malibuDatepicker();
```


By default, Malibu Datepicker uses the "dd/mm/yyyy" format. You can customize the format and other options by passing an object to the `malibuDatepicker` method:

```javascript
$("#datepicker").malibuDatepicker({
  format: "mm/dd/yyyy",
  separator: "-",
  minDate: "01/01/2020",
  maxDate: "12/31/2020",
  disabledDates: ["01/01/2021", "12/25/2021"],
  firstDayOfWeek: 1
});
```

## Contributing
We welcome contributions to Malibu Datepicker. To contribute, please follow these steps:

- Fork this repository
- Create a branch for your feature or bug fix
- Commit your changes
- Push your changes to your fork
- Submit a pull request

## License
Malibu Datepicker is released under the MIT License. See LICENSE.md for details.