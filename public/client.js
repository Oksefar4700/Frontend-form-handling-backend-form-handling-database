
//Sørger for, at javascript er det første der kører, når dokumentets indhold er indlæst.
document.addEventListener('DOMContentLoaded', function() {
    
    //Vi laver et netværkskald til /users endpoint på vores server.
    fetch('users')
    .then(response => response.json()) //Svaret der modtages konverteres til JSON.
    .then(users => {
        //Vi henter vores element med id'et 'usersList', og derefter indsætter brugerdataen i den.
        const list = document.getElementById('usersList');
        // for hver af bruger i vores modtagene liste:
        users.forEach(user => {
            //opretter vi et nyt listelement.
            const listItem = document.createElement('li');
            //Her sætter vi teksten af listelementet til brugeresn brugernavn.
            listItem.textContent = user.username;
            //Vi tilføjer det nye listeelement til ul-listen i html'en.
            list.appendChild(listItem);
        });
    })
    //Her har vi vores fejl-håndtering.
    .catch(error =>{
        console.error('Error getting user data: ' , error)
    });
});
