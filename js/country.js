const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.container');

function getCountry(name) {
    document.querySelector('.error-message').innerHTML=''
    countriesContainer.innerHTML='';
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${name}`);
  request.send();

  request.addEventListener('load', function () {
    if (request.status !== 200) {
      displayErrorMessage('Country not found the country information you looking for, Please enter a valid country.');
      return;
    }
    const [data] = JSON.parse(this.responseText);
    var html = ` <article class="country">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]} </p>
      <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name} ${Object.values(data.currencies)[0].symbol}</p>
    </div>
  </article>`;
    countriesContainer.insertAdjacentHTML('afterbegin', html);
  });

  request.addEventListener('error', function () {
    displayErrorMessage('An error occurred while fetching data.');
  });
}

function displayErrorMessage(message) {
    document.querySelector('.error-message').innerHTML= message
}
document.forms['countryForm'].addEventListener('submit', function(e){
    e.preventDefault()
    let value = document.forms['countryForm']['country'].value
    getCountry(value)
})
