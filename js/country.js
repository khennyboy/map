let value
let submit = document.querySelector('.submit_btn');
function getCountry(name) {
    document.querySelector('.error-message').innerHTML=''
    document.querySelector('.country') && document.body.removeChild(document.querySelector('.country'))
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${name}`);
  request.send();

  request.addEventListener('load', function () {
    submit.innerHTML='Fetch details';
    if (request.status !== 200) {
      displayErrorMessage('Country information not found, Please enter a valid country.');
      return;
    }
    const [data] = JSON.parse(this.responseText);
    console.log(data)
    let x = data.name.common.toLowerCase();
    if (name === x ){
    var html = ` <article class="country">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} Million</p>
      <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]} </p>
      <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name} ${Object.values(data.currencies)[0].symbol}</p>
      <p class='country__row'><span>👑</span><img class="coatOfArm" src="${data.coatOfArms.svg}" /></div>
    </div>
  </article>`;
    document.body.insertAdjacentHTML('beforeend', html);
    }
    else{
        displayErrorMessage('Country information not found, Please enter a valid country.');
    }
  });


  request.addEventListener('error', function () {
    submit.innerHTML='Fetch details';
    displayErrorMessage('An error occurred while fetching data.');
  });
}
// error message function
function displayErrorMessage(message) {
    document.querySelector('.error-message').innerHTML= message
}
// initial call
getCountry('nigeria');
// handle submit button
document.forms['countryForm'].addEventListener('submit', function(e){
    submit.innerHTML = 'Loading...'
    e.preventDefault()
    value = document.forms['countryForm']['country'].value.trim()
    value = value.toLowerCase() 
    getCountry(value)
})


