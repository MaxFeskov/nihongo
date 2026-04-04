import * as wanakana from "../libs/wanakana.js";
import { clearArr, isArr, randomSortArr } from "./arrays.js";
import { loadJSONList } from "./loaders.js";
import { getObjProp } from "./objects.js";

export const isCorrectAnswer = (answer, correctAnswer) => {
  if (wanakana.isKatakana(correctAnswer)) answer = wanakana.toKatakana(answer);
  if (wanakana.isHiragana(correctAnswer)) answer = wanakana.toHiragana(answer);

  if (answer === correctAnswer) return true;
};

export const numberToKanji = (nunber) => {
  const scalar = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const magnitude = [
    { order: 0, char: "" },
    { order: 1, char: "十" },
    { order: 2, char: "百" },
    { order: 3, char: "千" },
    { order: 4, char: "万" },
    { order: 8, char: "億" },
    { order: 12, char: "兆" },
    { order: 16, char: "京" },
  ].reverse();

  if (nunber.toString().search(/^(-)?[0-9]+(\.[0-9]+)?$/g) === -1) throw new TypeError("Input must be of type number");
  if (nunber <= 0) throw new TypeError("Input number must be positive");
  if (nunber % 1 !== 0)
    console.warn(`Input number will be rounded down to nearest integer value: ${Math.floor(nunber)}`);

  let result = "";
  let remainder = Math.floor(nunber);

  magnitude.forEach((m) => {
    const sigNumber = Math.floor(remainder / 10 ** m.order);
    if (sigNumber >= 1) {
      const sigNumberStr = sigNumber < 10 ? scalar[sigNumber] : numberToKanji(sigNumber);
      result += sigNumberStr + m.char;
      remainder -= sigNumber * 10 ** m.order;
    }
  });

  return result.replace("一十", "十").replace("一百", "百");
};

export const kanjiNumberToKana = (kanji) => {
  const t = {
    一: "いち",
    二: "に",
    三: "さん",
    四: "よん",
    五: "ご",
    六: "ろく",
    七: "なな",
    八: "はち",
    九: "きゅう",
  };
  const w1 = { 十: "じゅう", 百: "ひゃく", 千: "せん", 万: "まん", 億: "おく", 兆: "ちゃう", 京: "けい" };

  return wanakana.toKana(kanji, { customKanaMapping: Object.assign({}, t, w1) });
};

export const getSymbols = async (result, { baseFilters, extFilters } = {}) => {
  const symbolData = await loadJSONList(["data/kana/hiragana.json", "data/kana/katakana.json"]);

  const baseHiragana = getObjProp(symbolData[0], ["base"]);
  const extendedHiragana = getObjProp(symbolData[0], ["extended"]);
  const baseKatakana = getObjProp(symbolData[1], ["base"]);
  const extendedKatakana = getObjProp(symbolData[1], ["extended"]);

  const data = [];

  if (!baseFilters || baseFilters.includes("あ")) {
    data.push(...baseHiragana);

    if (!baseFilters || baseFilters.includes("extended")) data.push(...extendedHiragana);
  }

  if (!baseFilters || baseFilters.includes("ア")) {
    data.push(...baseKatakana);

    if (!baseFilters || baseFilters.includes("extended")) data.push(...extendedKatakana);
  }

  const answers = randomSortArr(
    data.filter(({ group }) => !extFilters || extFilters.includes(group)).map(({ symbol }) => symbol),
  );

  if (isArr(answers)) {
    clearArr(result);
    result.push(...answers);
  }
};
