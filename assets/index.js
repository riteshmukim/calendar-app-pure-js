import persons from './persons-data.js';
import materialColor from './color-generator.js';

console.log(persons);
// filter data
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// create filtered persons list for all the days and sort youngest to oldest
const filterPersonsList = (persons, days, year) => {
  const personsList = [];
  days.map((day, i) => personsList.push(persons.filter(person => {
    let birthday = new Date(person.birthday);
    birthday.setFullYear(year);
    return birthday.getUTCDay() === i;
  }).sort((a, b) => new Date(b.birthday) - new Date(a.birthday))
  ));
  return personsList;
}

// function to get initials of a person like 'RM' for Ritesh Mukim
const getInitials = name => {
  let initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

let yearToFindCalender = new Date().getFullYear();
let personsMasterList = persons;


const createCalendar = () => {
  const filteredList = filterPersonsList(personsMasterList, days, yearToFindCalender);

  const calendarContent = document.getElementById('calendar_content');
  calendarContent.innerHTML = ''; // removing the inner content of the calendar div

  // iterate over data and create individual persons
  days.map((day, i) => {
    const persons = filteredList[i];

    const dayBox = document.createElement('DIV');
    dayBox.classList.add('dayBox');

    const title = document.createElement('DIV');
    title.classList.add('title');
    title.appendChild(document.createTextNode(day));

    const listOfPerson = document.createElement("UL");

    if (persons.length <= 0) {
      listOfPerson.classList.add('day--empty');
    } else {
      persons.map(person => {
        const { name, birthday } = person;
        // size of the square box of individual person capped to max 4 in a row for better visibility
        const sizeOfPerson = (100 / Math.min(Math.ceil(Math.sqrt(persons.length)), 4)) + '%';

        const personElement = document.createElement("LI");
        personElement.appendChild(document.createTextNode(getInitials(name)));
        personElement.style.height = sizeOfPerson;
        personElement.style.width = sizeOfPerson;
        personElement.style.backgroundColor = materialColor();
        personElement.title = name + ' - ' + birthday;
        listOfPerson.appendChild(personElement);
      })
    }
    dayBox.appendChild(title);
    dayBox.appendChild(listOfPerson);
    calendarContent.appendChild(dayBox);
  });
};

createCalendar();

// attach data to form and handle update

const personDataEditElement = document.getElementById('personDataEdit');
personDataEditElement.innerHTML = JSON.stringify(persons, null, '\t');

const yearEditElement = document.getElementById('year');
yearEditElement.value = yearToFindCalender;

const datUpdateFormElement = document.getElementById('dataUpdateForm');
datUpdateFormElement.addEventListener("submit", event => {
  event.preventDefault();
  const { personData, year } = event.target.elements;
  try {
    const persons = JSON.parse(personData.value);
    personsMasterList = persons;
    yearToFindCalender = parseInt(year.value);
    personDataEditElement.classList.remove('error');
    createCalendar();
  } catch (error) {
    personDataEditElement.classList.add('error');
  }
});
