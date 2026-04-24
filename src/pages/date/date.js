import { setElementText } from "../../modules/html.js";
import { Voice } from "../../modules/vioce.js";

(async () => {
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

  const restart = () => {
    setElementText(historyEl, "");

    console.log("restart");

    answerEl.removeAttribute("disabled");
    answerEl.focus();
  };

  const reset = () => {
    stop();
    restart();
  };

  document.getElementById("form")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formEl = event.target;
    const answer = new FormData(formEl).get("answer");

    console.log({ answer });

    // voice.speak("１月８日");

    voice.speak("1月8日");
  });

  startEl.addEventListener("click", async () => {
    voice = new Voice({ lang: "ja-JP" });
    startEl.setAttribute("disabled", "disabled");
    stopEl?.removeAttribute("disabled", "disabled");

    restart();
  });

  stopEl.addEventListener("click", () => stop());
  resetEl.addEventListener("click", () => reset());
})();
