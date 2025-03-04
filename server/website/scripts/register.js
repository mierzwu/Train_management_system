function handleFormSubmit(event) {
    event.preventDefault(); // Zapobiega domyślnej akcji formularza
 
 // Pobieranie danych z registera
 const name = document.getElementById('name').value;
 const surname = document.getElementById('surname').value;
 if (document.getElementById("K").checked) 
    {
        var sex = 'K'
    }
else
{
    var sex = 'M'
}
 const date_of_birth = document.getElementById('date_of_birth').value;
 const email = document.getElementById('email').value;
 const phone_number = document.getElementById('phone_number').value;
 
//iframe wymaga specjalnego dostępu
const iframe = document.querySelector('iframe');
let id_document = null;
if (iframe && iframe.contentDocument) {
    const iframeDoc = iframe.contentDocument;
    id_document = iframeDoc.getElementById('id_document').value; 
}

 const password = document.getElementById('password').value;
 const password1 = document.getElementById('password1').value;
const register_form_data = { name, surname, sex, date_of_birth, email, phone_number, id_document, password, password1};

 //fetchowanie registera
 fetch('/register', {
     method: 'POST',
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify(register_form_data)
 })
 .then(response => response.json())
 .then(data => {
     console.log("Dane zostały wysłane:", data); //tu
     if(data.color == undefined)
     {
        displayResponseMessage(data.message, "red");
     }
     else {displayResponseMessage(data.message, data.color)};
 })
 
}
 
function displayResponseMessage(message, color) {
    const responseElement = document.getElementById('responseMessage');  // Get the div
    if (responseElement) {
        responseElement.textContent = message;  // Set the message text
        responseElement.style.color = color;    // Set the text color (green for success, red for error)
    } else {
        console.error("Response element not found!");
    }
}