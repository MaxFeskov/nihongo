import { appendElementText, getCheckedTextBySelector, setElementText } from "../../modules/html.js";
import { getSymbols, isCorrectAnswer } from "../../modules/kana.js";
import { Voice } from "../../modules/vioce.js";

(async () => {
  const answers = [];
  let answerIndex = -1;
  let voice;

  const startEl = document.getElementById("start");
  const stopEl = document.getElementById("stop");
  const resetEl = document.getElementById("reset");
  const answerEl = document.getElementById("answer");
  const symbolEl = document.getElementById("symbol");
  const historyEl = document.getElementById("history");

  const stop = () => {
    startEl?.removeAttribute("disabled", "disabled");
    stopEl?.setAttribute("disabled", "disabled");
    answerEl?.setAttribute("disabled", "disabled");
  };

  const reset = async () => {
    const symbols = [];

    await getSymbols(symbols);

    symbols.forEach((symbol) => {
      globalThis.localStorage.removeItem(symbol);
    });
  };

  const getNextAnswer = () => {
    const nextAnswer = answers[++answerIndex];

    if (!nextAnswer) return;

    const answerRaiting = Number(globalThis.localStorage.getItem(nextAnswer)) || 0;

    if (answerRaiting < 3) return nextAnswer;

    return getNextAnswer();
  };

  const restart = () => {
    answerIndex = -1;
    const nextAnswer = getNextAnswer();
    setElementText(symbolEl, nextAnswer);
    setElementText(historyEl, "");

    if (answerEl) {
      answerEl.removeAttribute("disabled");
      answerEl.focus();
    }
  };

  document.getElementById("form")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formEl = event.target;
    const answer = new FormData(formEl).get("answer");
    const correctAnswer = answers[answerIndex];

    if (answerIndex) appendElementText(historyEl, { text: " " });

    if (isCorrectAnswer(answer, correctAnswer)) {
      const answerRaiting = Number(globalThis.localStorage.getItem(correctAnswer)) || 0;
      globalThis.localStorage.setItem(correctAnswer, answerRaiting + 1);
    } else {
      appendElementText(historyEl, { className: "incorrect", text: correctAnswer });

      const answerRaiting = Number(globalThis.localStorage.getItem(correctAnswer)) || 0;
      globalThis.localStorage.setItem(correctAnswer, answerRaiting - 1);
    }

    voice.speak(correctAnswer);
    formEl.reset();

    const nextAnswer = getNextAnswer();
    nextAnswer ? setElementText(symbolEl, nextAnswer) : stop();
  });

  startEl.addEventListener("click", async () => {
    voice = new Voice({ lang: "ja-JP" });
    answerIndex = 0;
    startEl.setAttribute("disabled", "disabled");
    stopEl?.removeAttribute("disabled", "disabled");

    const baseFilters = getCheckedTextBySelector('.kana-filter-item:has(input[type="checkbox"]:checked)');
    const extFilters = getCheckedTextBySelector('.group-filter-item:has(input[type="checkbox"]:checked)');

    await getSymbols(answers, { baseFilters, extFilters });

    if (!answers.length) return stop();

    restart();
  });

  stopEl.addEventListener("click", () => stop());
  resetEl.addEventListener("click", () => reset());
  historyEl.addEventListener("click", (event) => {
    const { innerText, innerHTML } = event.target;

    if (innerText === innerHTML) voice.speak(innerText);
  });
})();
