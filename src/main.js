import axios from "axios";

const questions = {};

const preload = document.getElementById("preload");
const nextButton = document.getElementById("next");
const formWrapper = document.getElementById("wrapper");
const timer = document.getElementById("timer");
const questionTitle = document.getElementById("question-title");
let questionTimer;
let countdown = 30;
let currentQuestionIndex = 1;

// Generate array from body and shuffle content of body
function shuffleOptions(questionData) {
  let optionsArray = questionData.body.split("\n");
  let currentIndex = optionsArray.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [optionsArray[currentIndex], optionsArray[randomIndex]] = [
      optionsArray[randomIndex],
      optionsArray[currentIndex],
    ];
  }
  return optionsArray;
}

// Fetch question from api
function fetchQuestion(getIndex = 1) {
  const url = `https://jsonplaceholder.typicode.com/posts/${getIndex}`;
  preload.removeAttribute("style");
  return axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
      return null;
    });
}

// Generate options and label as well as question
function generateOptions(question) {
  questionTitle.innerText = question.title;
  let options = shuffleOptions(question);

  formWrapper.querySelectorAll("input").forEach((input, index) => {
    input.value = options[index];
  });
  formWrapper.querySelectorAll("label").forEach((label, index) => {
    label.innerText = options[index];
  });
}

// Init question
function initQuestion() {

  // Disable inputs
  const inputElements = document.querySelectorAll("input");
  inputElements.forEach((input) => input.setAttribute("disabled", true));

  // Start timer
  questionTimer = setInterval(function () {
    countdown--;
    if (countdown <= 27) {
      inputElements.forEach((input) => input.removeAttribute("disabled"));
    }

    // Update timer to inform user
    timer.innerText = countdown < 10 ? `00:0${countdown}` : `00:${countdown}`;

    // Finish the question when reached 0
    if (countdown <= 0) {
      clearInterval(questionTimer);
      resetCountdown();
      nextQuestion();
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(questionTimer);
  countdown = 30;
}

// Go to next question
function nextQuestion() {
  // Deselect input
  formWrapper.querySelectorAll("input").forEach((elem) => {
    elem.checked = false;
  });
  resetCountdown();
  currentQuestionIndex++;
  fetchQuestion(currentQuestionIndex)
    .then((data) => {
      initQuestion();
      generateOptions(data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    })
    .finally(() => (preload.style.display = "none"));
}
// Init the test
function initTest() {
  fetchQuestion(currentQuestionIndex)
    .then((data) => {
      initQuestion();
      generateOptions(data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    })
    .finally(() => (preload.style.display = "none"));
}

nextButton.addEventListener("click", () => {
  nextQuestion();
});

document.addEventListener("DOMContentLoaded", () => {
  preload.style.display = "none";
  initTest();
});
