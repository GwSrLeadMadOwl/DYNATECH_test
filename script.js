const introduction = document.querySelector("#intro");
const quiz = document.querySelector("#quiz");
const question = document.querySelector("#question");
const answerField = document.querySelector("#options-container");
let data = {};
console.log("globalData", data);
let options = document.querySelectorAll('#options-container > .option');
let siblings = [];

const spinner = document.querySelector("#loader-view");

const startBtn = document.querySelector("#start-button");
let submitBtn = document.querySelector("#submit-button");

quiz.style.display = "none";
submitBtn.disabled = true;
spinner.style.display = "none";
let yourScore = 0;

let questionNumber = 0;
let userAnswer;
console.log("userAnswer: ", userAnswer);

startBtn.addEventListener("click", async () => {
  introduction.style.display = "none";
  spinner.style.display = "block";
  const res = await fetch(`https://jsonmock.hackerrank.com/api/questions/`);
  data = await res.json();
  console.log("scopedData", data);
  if (data) {
    spinner.style.display = "none";
    quiz.style.display = "block";
    console.log("response ", data.data); updateQuizField(data);
    selectAnswer();
  } else {
    throw Error("Can't get response.");
  }
});

const selectAnswer = () => {
  options = document.querySelectorAll('#options-container > .option');
  console.log("Options NodeList", options);
  options.forEach(opt => {
    console.log("option", opt);
    opt.addEventListener("click", () => {
      for (let i = 0; i < options.length; i++) {
        prev = options;
        console.log("prev", prev);
        if (prev[i].classList.contains("user-answer") && prev[i].id != this.userAnswer) {
          prev[i].classList.remove("user-answer");
        }
      }
      opt.classList.add("user-answer");
      userAnswer = opt.id;
      console.log("userAnswer: ", userAnswer);
      submitBtn.disabled = false;
    });
  });
};

updateQuizField = (data) => {
  question.innerHTML = data.data[questionNumber].question;
  answerField.innerHTML = data.data[questionNumber].options.map((option, i) => { return `<div id="${i}" class="option">${option}</div>`; }).join("");
};

submitBtn.addEventListener("click", () => {
  if (userAnswer == data.data[questionNumber].answer) {
    for (let i = 0; i < options.length; i++) {
      prev = options;
      if (prev[i].id == userAnswer) {
        prev[i].classList.add("correct-answer");
        yourScore++;
      }
    }
    submitBtn.disabled = true;
  }
  else if (userAnswer != data.data[questionNumber].answer) {
    for (let i = 0; i < options.length; i++) {
      prev = options;
      if (prev[i].id == userAnswer) {
        prev[i].classList.add("wrong-answer");
      }
      if (prev[i].id == data.data[questionNumber].answer) {
        prev[i].classList.add("correct-answer");
      }
    }
    submitBtn.disabled = true;
  }

  if (questionNumber < data.data.length - 1) {
    setTimeout(() => {
      questionNumber++;
      console.log(questionNumber); updateQuizField(data);
      selectAnswer();
      submitBtn.disabled = true;
    }, 2000);
  } else {
    if (yourScore === 7) {
      question.innerHTML = `You answered ${yourScore} question of 7. You're genious!`;
    }
    question.innerHTML = `You answered ${yourScore} questions of 7.`;
    answerField.innerHTML = "";
    setTimeout(() => { window.location.reload(); }, 5000);
  }
});
