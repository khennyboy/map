const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');



class Workout{
    date = new Date();
    id =  (Date.now() +"").slice(-10)
    constructor(coords, distance, duration){
        this.coords = coords,
        this.distance = distance, //in km
        this.duration = duration //in minutes
    }
    _setDescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
        'October', 'November', 'December'];
        this.description= `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
}

class Running extends Workout{
    type= 'running'
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.cadence = cadence
        this.calcPace()
        this._setDescription()
    }
    calcPace(){
        // min/km or mil/km
        this.pace = this.duration / this.distance
        return this.pace
    }
}
class Cycling extends Workout{
    type='cycling'
    constructor(coords, distance, duration, elevationGain){
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed()
        this._setDescription()
    }
    calcSpeed(){
        //km/hr
        this.speed = this.distance/ (this.duration/60)
    }

}


class App{
    #map;
    #mapEvent;
    #workout=[];
    #mapZoomLevel=13;
    constructor(){
        this._getPosition()
        this._getLocalStorage()
        form.addEventListener('submit', this._newWorkOut.bind(this))
        inputType.onchange = this._toggleElevationField.bind(this)
        containerWorkouts.addEventListener('click', this._moveToPopUp.bind(this))
    }
    _getPosition(){
        if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
        alert('Couldnt get your location');
    })
    }
    else{
        console.error('Geolocation not supported by this browser')
    }
    }
    _loadMap(position){
        console.log(position)
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude)
        console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);
        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        .addTo(this.#map);
        // Handle clicks on map
        this.#map.on('click', this._showForm.bind(this)); 
        this.#workout.forEach(each_work=> this.renderWorkOutMarker(each_work))     
    }
    _showForm(mapE){
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus()
    }
    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden') //still confusing
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }
    _newWorkOut(e){
        e.preventDefault()
        const validInput = (...input) => input.every(inp=>Number.isFinite(inp))
        const  allPositive = (...input)=>input.every(inp=>inp>0)
            //Get data from form
            const type = inputType.value
            const distance = +inputDistance.value
            const duration = +inputDuration.value
            const {lat, lng} =  this.#mapEvent.latlng
            let workout
            // Check if data is valid

            // If activity running, create running object
            if(type==='running'){
                const cadence = +inputCadence.value
                if(!validInput(distance, duration, cadence) || !allPositive(distance, duration, cadence)){
                    return alert('Inputs have to be a positive numbers!')
                }
                 workout = new Running([lat, lng], distance, duration, cadence)
                 console.log('new workout')
                 console.log(workout)
            //Add new object to workout array
            this.#workout.push(workout)
            }
          
            //If activity cycling, create cycling object
            if(type==='cycling'){
                const elevation = +inputElevation.value
                if(!validInput(distance, duration, elevation) || !allPositive(distance, duration)){
                    return alert('Inputs have to be a positive numbers!')
                }
                 workout = new Cycling([lat, lng], distance, duration, elevation)
                 console.log('new workout')
                 console.log(workout)
                 //Add new object to workout array
                this.#workout.push(workout)
            }
            
             //Render workout on map as marker
            this.renderWorkOutMarker(workout)
              //Render workout on map list
            this._renderWorkout(workout)
            // Hide form +Clear input field
            this._hideForm()

            //set local storage to all workout
            this._setLocalStorage()
    }
    renderWorkOutMarker(choice){
          L.marker(choice.coords)
          .addTo(this.#map)
          .bindPopup(
          L.popup({
              maxWidth:250,
              minWidth:100,
              autoClose:false,
              closeOnClick:false,
              className:`${choice.type}-popup`,
          })
          )
          .setPopupContent(`${choice.type==='running'? '🏃‍♂️':'🚴‍♀️'} ${choice.description}`)
          .openPopup();
    }
    _renderWorkout(work){
        let html = `
         <li class="workout workout--${work.type}" data-id=${work.id}>
        <h2 class="workout__title">${work.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${work.type==='running'? '🏃‍♂️':'🚴‍♀️'}</span>
          <span class="workout__value">${work.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${work.duration}</span>
          <span class="workout__unit">min</span>
        </div>`
        if(work.type=='running'){
            html+=`     <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${work.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${work.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
        }
        if(work.type=='cycling'){
            html+=`   <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value"${work.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${work.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> `
        }
        form.insertAdjacentHTML('afterend', html); //confusing

    }

    _hideForm(){
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        form.style.display = 'none'
        form.classList.add('hidden')
        setTimeout(()=>form.style.display='grid', 1000)
    }
    _moveToPopUp(e){
        const workoutEl = e.target.closest('.workout')  //confusing
        console.log(workoutEl)
        if(!workoutEl) return '';

        const workout = this.#workout.find(work=>work.id===workoutEl.dataset.id); // confusing

        console.log(workout)
        // need to check documentation for this
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate:true,
            pan:{
                duration:1
            }
        })
    }
    _setLocalStorage(){
       localStorage.setItem('workout', JSON.stringify(this.#workout))
        console.log('localstorage')
        console.log(localStorage.workouts)
    }
    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workout'));
        if (!data) return '';
        this.#workout = data;
        console.log(this.#workout)
        this.#workout.forEach((each_work) => {
            this._renderWorkout(each_work);
        });
     }
     
}
const app = new App();


// const form = document.querySelector('.form');
// const inputDistance = document.querySelector('.form__input--distance');
// let marker;

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//         const { latitude, longitude } = position.coords;
//         const coords = [latitude, longitude];
//         const map = L.map('map').setView(coords, 13);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         marker = L.marker(coords).addTo(map);

//         map.on('click', function(mapEvent) {
//             const { lat, lng } = mapEvent.latlng;
//             console.log(lat, lng)
//             marker.setLatLng([lat, lng]); // Update marker's position
//             form.classList.remove('hidden');
//             inputDistance.focus();

//             if (!marker.getPopup()) {
//                 marker.bindPopup(
//                     L.popup({
//                         maxWidth: 250,
//                         minWidth: 100,
//                         autoClose: false,
//                         closeOnClick: false ,
//                         className: 'running-popup',
//                     })
//                 );
//             }

//             marker.setPopupContent('Workout').openPopup();
//         });
//     }, function() {
//         console.error('Could not get your location');
//     });
// } else {
//     console.error('Geolocation not supported by this browser');
// }

