class DatePickerElement extends HTMLElement {

    weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    DayOfMS = 86400000;

    today = new Date();

    yearListFirstYear;

    populatedDate;

    constructor() {

        super();
    }

    getPopulatedDate() {
        let val = this.getValue();
        return !!val ? val : new Date();
    }

    getValue() {
        let val = this.getAttribute("value");
        return !!val ? new Date(val) : null;
    }

    setValue(val) {
        if (!val) {
            this.setAttribute("value", val);
        } else {
            if (this.hasAttribute('value')) {
                this.removeAttribute('value');
            }
        }
    }

    connectedCallback() {
        this.innerHTML = `
            <input type="text" value="" class="date-picker-input" alt="" placeholder=""  >
            <div class="datepicker-container">
                <div class="dp-controller">
                    <button class="dp-prev-btn" >&#8249;</button>
                    <button class="dp-controller-btn"></button>
                    <button class="dp-next-btn">&#8250;</button>
                </div>
                <div class="dp-month">
                    <div class="dp-weekdays"></div>
                    <div class="dp-days-of-month"></div>
                </div>
                <div class="dp-month-list"></div>
                <div class="dp-year-list"></div>      
            </div>
        `;
        this.populateMonthDays(this.getPopulatedDate());
        this.populateYearPicker();
        this.populateMonthPicker();
        this.selectViewedPicker("monthDaysPicker");
        this.observeChanges();
        this.inputHandler();
        this.readDateFromInput();
    }

    readDateFromInput() {

        let datePickerInput = this.querySelector(".date-picker-input");
        datePickerInput.value = EnDatePicker.formatDate(this);

    }

    inputHandler() {
        let input = this.querySelector("input.date-picker-input");
        let container = this.querySelector(".datepicker-container");
        input.onfocus = () => {
            console.log("OnFocus");
            container.style.display = "block";
            document.addEventListener("click", EnDatePicker.handleClickOutsideOfDatePicker);
        }
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        console.log(attr, oldValue, newValue);
    }

    populateMonthDays(date) {
        this.populateWeekDays();
        let daysOfMonth = this.populateDays(date);

        let daysOfMonthContainer = this.querySelector(".dp-days-of-month");
        daysOfMonthContainer.innerHTML = '';
        daysOfMonth.forEach(dayOfMonth => {
            let day = document.createElement("span")
            if (dayOfMonth.isNextMonth) day.setAttribute("next-month", "");
            if (dayOfMonth.isPreviousMonth) day.setAttribute("previous-month", "");
            if (dayOfMonth.isToday) day.setAttribute("today", "");
            if (dayOfMonth.selected) day.setAttribute("selected", "");
            day.onclick = this.selectDate;
            day.setAttribute("time", new Date(dayOfMonth.date).getTime());
            day.innerText = new Date(dayOfMonth.date).getDate();
            daysOfMonthContainer.appendChild(day);
        });
        this.populatedDate = date;
        this.controllerBtnHandler(date);
    }

    selectDate(e) {
        let clicked = e.target;
        let datePicker = clicked.closest('datepicker')
        let time = new Date(Number(clicked.getAttribute("time")));
        let container = datePicker.querySelector(".datepicker-container");

        console.log("Day selected: " + e);
        document.querySelectorAll('[selected]').forEach(b => b.removeAttribute('selected'));
        clicked.setAttribute("selected", "");
        this.selectedDate = time;
        if (Number(clicked.getAttribute("value") !== time.getTime())) {
            datePicker.onValueChange(time);
        }

        datePicker.setAttribute("value", time)
        let datePickerInput = datePicker.querySelector(".date-picker-input");
        datePickerInput.value = EnDatePicker.formatDate(datePicker);
        container.style.display = "none";
    }

    onValueChange(e) {
        console.log("From Inside", e);
    }

    populateWeekDays() {
        let weekDaysContainer = this.querySelector(".dp-weekdays");
        weekDaysContainer.innerHTML = '';
        let index = this.weekDays.length;
        for (let i = 0; i < index; i++) {
            let weekDay = document.createElement("span");
            weekDay.innerText = this.weekDays[i];
            weekDaysContainer.appendChild(weekDay);
        }
    }

    populateYearPicker() {
        let container = this.querySelector(".dp-year-list");
        if (!container) return;

        while (container.firstChild) {
            container.firstChild.remove();
        }

        let zeroPoint;
        if (this.yearListFirstYear) {
            zeroPoint = this.yearListFirstYear;
        } else {
            let currentYear = this.populatedDate.getFullYear();
            zeroPoint = currentYear - (currentYear % 12);
            this.yearListFirstYear = zeroPoint;
        }

        for (let year = zeroPoint; year < (zeroPoint + 12); year++) {
            let span = document.createElement("span");
            span.setAttribute("value", year);
            span.innerText = year;
            span.addEventListener("click", (e) => {
                let clickedYear = Number(e.target.getAttribute("value"));
                console.log("Clicked Year: " + clickedYear);
                this.populatedDate.setFullYear(clickedYear);
                this.populateMonthDays(this.populatedDate);
                this.selectViewedPicker("monthListPicker")
            })
            container.appendChild(span);
        }
    }

    goNextYearList = (e) => {
        this.yearListFirstYear += 12;
        this.populateYearPicker();
    }

    goPreviousYearList = (e) => {
        this.yearListFirstYear -= 12;
        this.populateYearPicker();
    }

    populateMonthPicker() {
        let monthPickerWrapper = this.querySelector(".dp-month-list");
        monthPickerWrapper.innerHTML = '';
        for (let i = 0; i < this.months.length; i++) {
            let span = document.createElement("span");
            span.setAttribute("value", i);
            span.innerHTML = this.months[i];
            span.onclick = (e) => {
                let date = this.populatedDate;
                let monthIndex = e.target.getAttribute("value");
                date.setMonth(Number(monthIndex));
                this.populateMonthDays(date);
                console.log("Month Selected: " + this.months[i])
                this.selectViewedPicker("monthDaysPicker");
            }
            monthPickerWrapper.appendChild(span);
        }
    }


    goNextMonth = (e) => {
        let date = this.populatedDate;
        if (date) {
            date.setMonth(date.getMonth() + 1);
            this.populateMonthDays(date);
        }
    }

    goPreviousMonth = (e) => {
        let date = this.populatedDate;
        if (date) {
            date.setMonth(date.getMonth() - 1);
            this.populateMonthDays(date);
        }
    }

    selectViewedPicker(picker) {

        let monthDaysPicker = this.querySelector(".dp-month");
        let monthListPicker = this.querySelector(".dp-month-list");
        let yearListPicker = this.querySelector(".dp-year-list");

        if (monthDaysPicker) monthDaysPicker.style.display = "none";
        if (yearListPicker) yearListPicker.style.display = "none";
        if (monthListPicker) monthListPicker.style.display = "none";

        let controllerBtn = this.querySelector(".dp-controller-btn");
        if (!controllerBtn) return;

        let prevBtn = this.querySelector(".dp-prev-btn");
        let nextBtn = this.querySelector(".dp-next-btn");

        prevBtn.style.display = "inline-block";
        nextBtn.style.display = "inline-block";

        let viewedPicker;
        let controllerBtnTargetPicker;
        let prevBtnHandler = this.goPreviousMonth;
        let nextBtnHandler = this.goNextMonth;
        switch (picker) {
            case 'monthDaysPicker': {
                viewedPicker = monthDaysPicker;
                controllerBtnTargetPicker = "monthListPicker"
                break;
            }
            case 'monthListPicker': {
                viewedPicker = monthListPicker;
                controllerBtnTargetPicker = "yearListPicker";
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                break;
            }
            case 'yearListPicker' : {
                viewedPicker = yearListPicker;
                controllerBtnTargetPicker = "monthDaysPicker";
                prevBtnHandler = this.goPreviousYearList;
                nextBtnHandler = this.goNextYearList;
                break;
            }
            default : {
                viewedPicker = monthDaysPicker;
                controllerBtnTargetPicker = "monthDaysPicker"
                break;
            }
        }

        prevBtn.onclick = prevBtnHandler;
        nextBtn.onclick = nextBtnHandler;


        viewedPicker.style.display = "grid";
        controllerBtn.onclick = () => {
            this.selectViewedPicker(controllerBtnTargetPicker);
        }
    }


    observeChanges() {
        const observer = new MutationObserver(() => {
            console.log('Mutation Observer is called.')
        });

        observer.observe(this, {attributeFilter: ['value'], attributes: true});


    }

    populateDays(curr) {
        let daysOfMonth = [];
        let objects = [];
        let firstDayOfMonth = new Date(curr.getFullYear(), curr.getMonth());
        let index = firstDayOfMonth.getDay() - 1;
        if (firstDayOfMonth.getDay() === 0) {
            index += 7;
        }

        daysOfMonth[index] = firstDayOfMonth;
        objects[index] = this.collectDayProps(curr, firstDayOfMonth);
        for (let i = index; i > 0; i--) {
            let previousDay = new Date(daysOfMonth[i].getTime() - 1);
            let indexDay = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate());
            daysOfMonth[i - 1] = indexDay;
            objects[i - 1] = this.collectDayProps(curr, indexDay);
        }

        for (let i = index + 1; i < 42; i++) {
            let nextDay = new Date(daysOfMonth[i - 1].getTime() + this.DayOfMS);
            let indexDay = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());
            daysOfMonth[i] = indexDay;
            objects[i] = this.collectDayProps(curr, indexDay);
        }

        this.controllerBtnHandler(curr);
        return objects;
    }

    collectDayProps(curr, indexDay) {
        let isToday = this.today.getFullYear() === indexDay.getFullYear()
            && this.today.getMonth() === indexDay.getMonth()
            && this.today.getDate() === indexDay.getDate();
        let selected = false;
        let selectedDate = this.getValue();
        if (this.getValue()) {
            selected = selectedDate.getFullYear() === indexDay.getFullYear()
                && selectedDate.getMonth() === indexDay.getMonth()
                && selectedDate.getDate() === indexDay.getDate();
        }
        return {
            date: indexDay.getTime(),
            isPreviousMonth: curr.getMonth() > indexDay.getMonth(),
            isNextMonth: curr.getMonth() < indexDay.getMonth(),
            isToday,
            selected
        };
    }

    controllerBtnHandler(date) {
        let controllerBtn = this.querySelector(".dp-controller-btn");
        if (controllerBtn)
            controllerBtn.innerText = this.months[date.getMonth()] + " " + date.getFullYear();
    }


}

class EnDatePicker {
    static formatDate(datePicker) {
        let date = datePicker.getValue();
        if (!date) return '';
        let format = datePicker.getAttribute('date-format');
        let month = date.getMonth() + 1;
        if (month < 10) month = "0" + month
        let day = date.getDate();
        if (day < 10) day = "0" + day;
        let year = date.getFullYear();
        switch (format) {
            case 'MM/DD/YY':
            default: {
                return month + "/" + day + "/" + year;
            }
            case 'DD/MM/YY' : {
                return day + "/" + month + "/" + year;
            }
            case 'YY-MM-DD' : {
                return year + "-" + month + "-" + day;
            }
        }
    }

    static handleClickOutsideOfDatePicker(e) {
        let datepicker = e.target.closest('datepicker');
        debugger;
        console.log("handleClickOutsideOfDatePicker is run.")

        let containerList = document.querySelectorAll(".datepicker-container");

        if (datepicker) {
            let dp = datepicker.querySelector('.datepicker-container');
            containerList.forEach(container => {
                if (container !== dp) {
                    container.style.display = "none";
                }
            });
        } else {
            containerList.forEach(container => {
                container.style.display = "none";
            });
            document.removeEventListener("click", EnDatePicker.handleClickOutsideOfDatePicker);
        }

        // document.removeEventListener("click", EnDatePicker.handleClickOutsideOfDatePicker);

    }

}

function datePickerInputListener(e) {

    if (e.keyCode < 48 || e.keyCode > 57) {
        console.log("Non Numeric: " + e.key + " - Key Code: " + e.keyCode)
    } else {
        console.log("Numeric: " + e.key + " - Key Code: " + e.keyCode)
    }

    let datePickerInput = document.querySelector(".date-picker-input");
    validation.test(datePickerInput.value);
    console.log("Validation: " + validation.test(datePickerInput.value))

}

const validation = new RegExp("\\d{2,4}[-/]\\d{1,2}[-/]\\d{1,4}");

document.addEventListener("DOMContentLoaded", () => {
    customElements.define('malibu-datepicker', DatePickerElement);


    let datePickerInput = document.querySelector(".date-picker-input");
    datePickerInput.addEventListener("keydown", datePickerInputListener);

    validation.test(datePickerInput.value);

    let container = document.querySelector(".datepicker-container");

    datePickerInput.addEventListener("focusout", () => {
        if (container) {

        }
    })


});

