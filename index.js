import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-ee281-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const msgFieldEl = document.getElementById("msg-field")
const pubBtnEl = document.getElementById("pub-btn")
const fromFieldEl = document.getElementById("from-field")
const toFieldEl = document.getElementById("to-field")
const endorsementListEl = document.getElementById("endorsement-list")

let senderEl = document.getElementById("sender")
let recipientEl = document.getElementById("recipient")


pubBtnEl.addEventListener("click", function () {
    let msgValue = msgFieldEl.value
    let sender = fromFieldEl.value
    let recipient = toFieldEl.value

    if (!msgValue || !sender || !recipient) {
        alert('Please fill in all fields.')
        return
    }

    push(endorsementListInDB, {
        sender: sender,
        recipient: recipient,
        message: msgValue,
        likes: 0
    })

    clearFieldsEl()

})

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let endorsementsArray = Object.entries(snapshot.val())

        clearEndorsementList()

        for (let i = 0; i < endorsementsArray.length; i ++) {
            let currentEndorsementItem = endorsementsArray[i]
            let currentEndorsementItemID = currentEndorsementItem[0]
            let currentEndorsementItemValue = currentEndorsementItem[1]

            appendToEndorsementList(currentEndorsementItemID, currentEndorsementItemValue)

        }

    } else {
        endorsementListEl.innerHTML = `<p class="hint">No endorsements here... yet!</p>`
    }

})

function clearFieldsEl() {
    msgFieldEl.value = ""
    fromFieldEl.value = ""
    toFieldEl.value = ""
}

function clearEndorsementList() {
    endorsementListEl.innerHTML = ""
}

function getRandomColor() {
    const color = ['D6E4FF', '#FFD6D6', '#EFD6FE', '#E7FFD6', '#FEF3C7', '#FFD4FD', '#FFD4F5'];
    return color[Math.floor(Math.random() * color.length)];

  }

function appendToEndorsementList(id, value) {
    let newCard = document.createElement("div")
    newCard.classList.add("endorsement-card")
    newCard.style.backgroundColor = getRandomColor()

    newCard.innerHTML = `
    <p class="recipient"><strong>To ${value.recipient}</strong></p>
    <p id="message">${value.message}</p>
    <div id="foot">
        <p class="sender"><strong>From ${value.sender}</strong></p>
        <p id="reaction"><strong><span id="likeCount">❤️ ${value.likes}</span></strong></p>
    </div>
`;

const likeBtn = newCard.querySelector("#reaction");

likeBtn.addEventListener("click", function(event) {
    value.likes += 1;
    event.stopImmediatePropagation()
    newCard.querySelector("#likeCount").innerText = `❤️ ${value.likes}`;
});

newCard.addEventListener("click", function () {
    let exactLocationOfEndorsementsInDB = ref(database, `endorsementList/${id}`)
    remove(exactLocationOfEndorsementsInDB)
})

    endorsementListEl.append(newCard)
}

  const maxLength = 160; // Maximum allowed characters

  msgFieldEl.addEventListener('input', () => {
    if (msgFieldEl.value.length > maxLength) {
      // Truncate the input to the maximum length
      msgFieldEl.value = msgFieldEl.value.substring(0, maxLength);

      // Display a warning message
      alert(`You can only enter up to ${maxLength} characters.`);
    }
  });




