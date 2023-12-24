var x =[2, 3 , 8, 9]
console.log(x)
var text ='' 
function unique(value, index){
    text = `i am value ${value} at index ${index}`
    console.log(text)
}
x.forEach(unique)
// creating a 40 unique random number out of 50 numbers
const userInput = [2,45,7,24,34,16];
const generate=new Set()
var total_generate= 44;
 for(var i=0; generate.size<=total_generate; i++){
    var x = Math.floor(Math.random()*50) + 1
    generate.add(x)
}  
var randomData = [...generate]
console.log(userInput)
console.log(randomData)
const validateData = (userInput, randomData) =>{
    return userInput.every(eachInput=>randomData.includes(eachInput))
}
let allIncluded = validateData(userInput, randomData)
console.log(allIncluded)
if(allIncluded){
    console.log('Hurray!, you won')
}
else{
    console.log('Try again next time')
}



