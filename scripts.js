"use strict";

// Endpoint: Postman Mock Server: https://6f186305-ab26-4839-b806-380e3560e049.mock.pstmn.io/sign-offs

// 	generate a random number between 0 and the length of the returned array of signatures
// Thanks, MDN
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

// date objects to be used in the local storage option to determine whether or not to make a new call to the server in case there are new signatures
// FUTURE ADDITION
// let created = new Date("2023-05-04");
// let now = new Date();

function fetchSignature(e){
    // we're in a form, so prevent submission
    e.preventDefault();
    
    // paragraph to display signature
    let output = document.getElementById("output");
    
    // empty string to build output
    let html = "";
    
    // if the user has already requested all of the signatures once, they will be in their local storage, so let's check for those before we make another call to the server
    let localCopy = localStorage.getItem("sigs") || "";
    
    if(localCopy){
        // the user has already called the endpoint once, so they have a copy of the data in local storage. We can pull from that instead of calling again

        let jsonSigs = JSON.parse(localCopy);

        // then, using the radio buttons, determine how many signatures to display
        if(document.getElementById("one").checked){
            // the user only wants one signature, so show them one
            
            // generate a random number to use to access an element in the array
            let random = getRandomIntInclusive(0, jsonSigs.signatures.length);

            // get the random signature from the returned signatures array and add it to the string
            html = `<span id="msg">Your signature, milady:</span>
                                <span id="sig">${jsonSigs.signatures[random]}</span>`;
        }else{
            // they want them ALL. Let's GOOOOOO
            
            // first, a message
            html += `<span id="msg">Your plethora of nonsense, Jeeves:</span>`;
            
            // then generate the rest of the string of signatures
            for(let signature of jsonSigs.signatures){
                html += `<span class="multi-sig">&bull;&nbsp;${signature}</span>`;
            }
        }
        
        // add the HTML string to the page
        output.innerHTML = html;

    }else{
        // this means that the endpoint has never been called, so we can make the request and add it to local storage if they chose to grab all of the signatures at once

        // settings/options for the request
        let requestOptions = {
                method: 'GET'
                // redirect: 'follow' // for Postman
            };

        let url = "https://api.jsonbin.io/v3/b/645476c4b89b1e229997300a";
        // let url = 

        // the call to the server and handling of data returned
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            // add the results array to local storage to pull from on future button clicks
            let sigString = JSON.stringify(result);

            // add that string to local storage
            localStorage.setItem("sigs", sigString);

            // using the radio buttons, determine how many signatures to display
            if(document.getElementById("one").checked){
                // the user only wants one signature, so show them one
                
                // generate a random number to use to access an element in the array
                let random = getRandomIntInclusive(0, result.signatures.length);

                // get the random signature from the returned signatures array and add it to the string
                html = `<span id="msg">Your signature, milady:</span>
                                    <span id="sig">${result.signatures[random]}</span>`;
            }else{
                // they want them ALL. Let's GOOOOOO
                
                // first, a message
                html += `<span id="msg">Your plethora of nonsense, Jeeves:</span>`;
                
                // then generate the rest of the string of signatures
                for(let signature of result.signatures){
                    html += `<span class="multi-sig">&bull;&nbsp;${signature}</span>`;
                }
            }
            
            // add the HTML string to the page
            output.innerHTML = html;
            
        })
        .catch(error => {
            // display error msg to user
            output.innerHTML = `Oh dear. I do believe something hath shat itself on the interweb. Try again.`;
            
            // log error to console
            console.error('error', error);
            
        });
    }
}


// event listener so we call this on button click
document.getElementById("get-it").addEventListener("click", fetchSignature);
