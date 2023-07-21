import axios from "axios";

const questions = {};

const preload = document.getElementById("preload");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const formWrapper = document.getElementById("wrapper");
const timer = document.getElementById("timer");
const questionTitle = document.getElementById("question-title");
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


// Create input element with radio type
function createInput() {
  const optionInput = document.createElement("input");
  optionInput.setAttribute("type", "radio");
  optionInput.setAttribute("id", "ornek");

  return optionInput;
}

function generateOptions(question) {
  questionTitle.innerText = question.title;
  let options = shuffleOptions(question);
  let inputCount = formWrapper.childElementCount;

  for (let i = 0; i < options.length; i++) {
    // If inputs are already created
    if (inputCount > 0) {
      // Create input elements with radio type
      formWrapper.appendChild(createInput());
    } else {
      // Update content of inputs
      formWrapper.querySelectorAll("input").forEach((input, index) => {
        input.value = index;
      });
    }
  }

  if (inputCount > 0) {
    for (let i = 0; i < options.length; i++) {
      const optionInput = document.createElement("input");
      optionInput.setAttribute("type", "radio");
      optionInput.setAttribute("id", "ornek");
      formWrapper.appendChild(optionInput);
    }
  } else {
  }
}

// Init question
function initQuestion(question) {
  let countdown = 30;

  // Generate options from question object
  generateOptions(question);

  // Disable inputs
  const inputElements = document.querySelectorAll("input");
  inputElements.forEach((input) => input.setAttribute("disabled", true));

  // Start timer
  setInterval(function () {
    // Enable inputs after 10 seconds
    if (countdown <= 20) {
      inputElements.forEach((input) => input.removeAttribute("disabled"));
    }

    // Update timer to inform user
    timer.innerText = `00:${countdown}`;
    inputElements.forEach((input) => (input.value = countdown));

    // Finish the question if when reached 0
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
  currentQuestionIndex++;
}

// Go to previous question
function prevQuestion() {
  console.log("prev");
  currentQuestionIndex--;
}

// Init the test
function initTest() {
  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => {
      const data = response.data;
      console.log(data.body);
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
prevButton.addEventListener("click", (e) => {
  if (currentQuestionIndex === 1) {
    e.preventDefault();
  } else {
    prevQuestion();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (currentQuestionIndex === 1) {
    prevButton.style.display = "none";
    prevButton.parentNode.style.justifyContent = "flex-end";
  } else {
    prevButton.removeAttribute("style");
    prevButton.parentNode.removeAttribute("style");
  }
  initTest();
});
