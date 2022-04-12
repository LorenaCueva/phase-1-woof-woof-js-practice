fetchDogs(false)

function fetchDogs(flag){
    fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(dogs => {
        document.getElementById('dog-bar').innerHTML =" "
        document.getElementById('dog-info').innerHTML=" "
        dogs.forEach(dog => fillDogBar(dog, flag))})
    .catch(error => window.alert(error.message))
    document.getElementById('good-dog-filter').addEventListener('click', filterDogs)
}

function filterDogs(){
    filterBtn = document.getElementById('good-dog-filter')
    if(filterBtn.innerText.includes('OFF')){
        filterBtn.innerText = "Filter good dogs: ON"
        fetchDogs(true)
    }
    else{
        filterBtn.innerText = "Filter good dogs: OFF"
        fetchDogs(false)        
    }
}

function fillDogBar(dog, flag){
    if(flag === false || (flag && dog.isGoodDog)){
        const doggo = document.createElement('span')
        doggo.innerText = dog.name
        document.getElementById('dog-bar').append(doggo)
        doggo.addEventListener('click', e => moreInfo(dog))
    }
}

function moreInfo(dog){
    fetch(`http://localhost:3000/pups/${dog.id}`)
    .then(response => response.json())
    .then(obj => {
        const dogInfo = document.getElementById('dog-info')
        dogInfo.innerHTML = " "
        const dogImage = document.createElement('img')
        dogImage.src = dog.image
        const dogName = document.createElement('h2')
        dogName.innerText = dog.name
        const goodBtn = document.createElement('button')
        if(obj.isGoodDog){
            goodBtn.innerText = 'Good Boy!'
             }
        else{
            goodBtn.innerText = 'Bad Boy!'
            }
        goodBtn.addEventListener('click', (e, doggo) => toggleGood(e, obj))
        dogInfo.append(dogImage, dogName, goodBtn)
 })
    .catch(error => window.alert(error.message))
}
    


function toggleGood(e, dog){
    fetch(`http://localhost:3000/pups/${dog.id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "isGoodDog": !(dog.isGoodDog)
        })
    })
    .then(response => response.json())
    .then(obj => { moreInfo(obj)
        if(document.getElementById('good-dog-filter').innerText.includes('ON') && obj.isGoodDog === false){
            window.alert(`${obj.name} is a bad boy and is going away`)
            fetchDogs(true)
        }
    })
    .catch(error => window.alert(error.message))
}
