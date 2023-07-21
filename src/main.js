import axios from "axios";

let questions = [];
let questionInstance = {};

const preload = document.getElementById("preload");
const nextButton = document.getElementById("next");
const formWrapper = document.getElementById("wrapper");
const quizForm = document.getElementById("quiz-form");
const contentArea = document.getElementById("content-area");
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
  // Print question and add title to the current question object
  questionTitle.innerText = questionInstance.title = question.title;
  questionInstance.options = {};

  let options = shuffleOptions(question);

  // Update button text
  if (currentQuestionIndex === 10) {
    nextButton.innerText = "Testi Bitir";
  }

  // Update input and label values
  formWrapper.querySelectorAll("input").forEach((input, index) => {
    input.value = options[index];
    const getId = input.id;
    questionInstance.options[getId] = options[index];
  });
  formWrapper.querySelectorAll("label").forEach((label, index) => {
    label.innerText = options[index];
  });
}

// Init timer for question
function initQuestion() {
  // Disable inputs
  const inputElements = document.querySelectorAll("input");
  // inputElements.forEach((input) => input.setAttribute("disabled", true));

  // Start timer
  questionTimer = setInterval(function () {
    if (countdown <= 20) {
      inputElements.forEach((input) => input.removeAttribute("disabled"));
    }

    // Update timer to inform user
    timer.innerText = countdown < 10 ? `00:0${countdown}` : `00:${countdown}`;

    // Finish the question when reached 0
    if (countdown <= 0) {
      clearInterval(questionTimer);
      resetCountdown();
      nextQuestion();
    } else {
      countdown--;
    }
  }, 1000);
}

// Reset countdown of timer
function resetCountdown() {
  clearInterval(questionTimer);
  countdown = 30;
}

function submitAnswers() {
  let rows = "";
  for (let i = 0; i < questions.length; i++) {
    let getOption = questions[i].selected;
    let answer = getOption !== "" ? questions[i].options[getOption] : "";
    rows += `
    <tr class="bg-white border-b">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            ${i+1}
        </th>
        <td class="px-6 py-4">${questions[i].title}</td>
        <td class="px-6 py-4 ${answer === "" ? "text-red-600" : ""}">${answer !== "" ? answer : "Boş Bırakılmış"}</td>
    </tr>`;
  }

  timer.remove();
  contentArea.innerHTML = `
    <table class="w-full text-sm text-center text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3">Soru Sayısı</th>
                <th scope="col" class="px-6 py-3">Soru</th>
                <th scope="col" class="px-6 py-3">Cevap</th>
            </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>
    `;
}

// Go to next question
function nextQuestion() {
  // Check if any answer is selected
  let isChecked = false;
  let val = "";
  formWrapper.querySelectorAll("input").forEach((elem) => {
    if (elem.checked) {
      isChecked = true;
      val = elem.id;
      elem.checked = false;
      elem.blur();
    }
  });

  // If user selected answer, pass the argument or pass blank
  questionInstance["selected"] = isChecked ? val : "";
  questions.push(questionInstance);
  questionInstance = {};

  // Reset timer
  resetCountdown();

  // If user reached the last question
  if (currentQuestionIndex === 10) {
    submitAnswers();
  } else {
    // Increment question index
    currentQuestionIndex++;

    // Fetch next question
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
  initTest();
});
