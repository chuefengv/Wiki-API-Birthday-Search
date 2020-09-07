//wait for the user to enter in a month first, before selecitng a day
function unlockDay(){
    document.getElementById("days").disabled=false;
}

//wait for the user to enter a valid day before unlocking search
function unlockSearch(){
    document.getElementById("search").disabled=false;
}

function capitalize_Words(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function searchDate(){
    //wiki api for search, with an empty topic
    let wikiUrl ='https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=';
    let url1 = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=';
    let url2 = '&origin=*&prop=text&format=json&formatversion=2';

    //get the value of the input bar on screen
    //let userInput = document.getElementById("test").value;
    let month = document.getElementById("months").value;
    let day = document.getElementById("days").value;
    let userInput = String(month)+"_"+String(day);
    //console.log(month);

    //combine the user input with the API URL to get completed search
    let finalUrl = url1+userInput+url2;

    //create a new http request method
    let xhr = new XMLHttpRequest();
    //open the connection to the server 
    xhr.open('GET', finalUrl, true);


    //when the request is served and loaded, turn it into json 
    xhr.onload = function() {
        // Parse the request into JSON
        let data = JSON.parse(this.response);
        //console.log(data.parse.text);
        //takes in the HTML text and converts it into a DOM, useful so we can manipulate the HTML data
        let birthdayDoc = new DOMParser().parseFromString(data.parse.text,"text/xml")

        //this variable goes into the birth section of the wiki
        let birthUL = birthdayDoc.getElementsByTagName("ul");
        //console.log("hello1");

        //this variable grabs the row of the birth section
        let birthLI = birthUL[2].getElementsByTagName("li");
        //console.log(birthLI);

        //this is the number of birthday entries for this month/day
        let birthEntries = birthLI.length;

        //checks to see if there is a number within the string
        function hasNumber(myString) {
            return /\d/.test(myString);
        }
        
        //empty array that will hold all the names of the famous people born this day
        let famousPeople = [];
        //console.log("hello2")

        try{
            for(let i = 0; i<birthEntries; i++){
                //this variable grabs the year and name of the person in said row
                let birthA = birthLI[i].getElementsByTagName("a");
                //console.log("hello3")

                    //if checks to see if it a number, or if the string has numbers
                if(isNaN(birthA[0].textContent) || !hasNumber(birthA[0].textContent)){
                        //if the passes the check, use the first 'a' tag
                        //then populate the array with the famous person's name
                    famousPeople[i] = (birthA[0].textContent);
                    //console.log("hello4")
                }else{
                        //if it fails the check, use the second 'a' tag
                        //then populate the array with the famous person's name
                    famousPeople[i] = (birthA[1].textContent);
                }
            }
        }catch(err){
            //incase there is an error, just show that there is no data available
            document.getElementById("person").innerText="No Data Available";
        }
        //choose a random index from the array to choose a random person that was born on this date
        let randomIndex = Math.floor(Math.random()*birthEntries);
        let chosenPerson = famousPeople[randomIndex];
        let screenResult = document.getElementById("person");

        //last check to see if the text is not a name
        if(hasNumber(chosenPerson) || typeof(chosenPerson)=== "undefined"){
            screenResult.innerText="No Data Available";
            screenResult.href="#";
        }else{
            //if not a number, then change the info on screen
            screenResult.innerText=(chosenPerson);
            //creates a URL to the persons personal wiki
            let personUrl = chosenPerson.replace(/ /g, "_");
            screenResult.href="https://en.wikipedia.org/wiki/"+personUrl;
        }

        let capitalName;
        //capitalize the letters in the name
        try{
            capitalName = (capitalize_Words(chosenPerson)).replace(/ /g, "_");
            //console.log(capitalName);

        }catch(err){
            document.getElementById("person").innerText="No Data Available";
        }
//------------------------------
        //create a new http request method
        let xhr2 = new XMLHttpRequest();
        //change the prop from text to images
        let url3 = "https://en.wikipedia.org/w/api.php?action=query&titles=";
        let url4 = "&SameSite=None&prop=pageimages&format=json&origin=*&pithumbsize=100";
        //search for the persons page
        let pictureUrl = url3+capitalName+url4;

        //open the connection to the server 
        xhr2.open('GET', pictureUrl, true);

        xhr2.onload = function(){

            //read the json data to look or thumbnail image source
            let data2 = JSON.parse(this.response);
            let page = data2.query.pages;
            let pageId = Object.keys(page);
            
            try{
                //if there is a thumbnail, show it on the main page
                //console.log(page[pageId].thumbnail.source);
                document.getElementById("photo").src=page[pageId].thumbnail.source;
            }catch(err){
                //if there is no thumbnail, then show the "no image" photo
                //console.log("There was no url");
                document.getElementById("photo").src="no_image.png";
            }
        }

        xhr2.send();
//---------------------------------
    }
    //send request to server 
    xhr.send();
}

//check if the date entered is valid for searching
function checkDate(){
    let month = document.getElementById("months").value;

    let day = document.getElementById("days").value;
    //if the days chosen for february exceeds 29
     if(month == "February" && day>29){
         alert("February only has 29 days, maximum");
    //if the days for these months exceeds 30
     }else if((month == "April" || month =="June" || month=="September" || month=="November") && day>30){
         alert(month + " only has a 30 days, maximum");
    //if none of the chosen months, continue
     }else {
        //console.log("yes");
        searchDate();
     }


}


