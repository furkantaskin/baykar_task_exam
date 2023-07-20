import axios from "axios";

const questions = {};

const preload = document.getElementById("preload");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const formWrapper = document.getElementById("wrapper");
const timer = document.getElementById("timer");
const questionTitle = document.getElementById("question-title");
let currentQuestionIndex = 1;

function generateOptions(question) {
    questionTitle.innerText = question.title;
}

// Init question
function initQuestion(question) {
  let countdown = 30;

  // Generate options from question object
  generateOptions(question);
  
  // Disable inpuyts
  const inputElements = document.querySelectorAll("input");
  inputElements.forEach((input) => input.setAttribute("disabled", true));
  
  // Start timer
  setInterval(function () {
    if (countdown <= 20) {
      inputElements.forEach((input) => input.removeAttribute("disabled"));
    }
    timer.innerText = `00:${countdown}`;
    inputElements.forEach((input) => (input.value = countdown));

    if (countdown === 0) {
      clearInterval();
    } else {
      countdown--;
    }
  }, 1000);
}

// Go to next question
function nextQuestion() {
  console.log("next");
}


// Go to previous question
function prevQuestion() {
  console.log("prev");
}


// Init the test
function initTest() {
  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => {
      const data = response.data;
      initQuestion(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      preload.style.display = "none";
    });
}

nextButton.addEventListener("click", nextQuestion);
prevButton.addEventListener("click", prevQuestion);

document.addEventListener("DOMContentLoaded", initTest);
