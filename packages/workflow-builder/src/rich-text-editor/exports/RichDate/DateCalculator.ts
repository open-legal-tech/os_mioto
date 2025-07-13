import Mexp from "math-expression-evaluator";

export const DateCalculator = new Mexp();
DateCalculator.addToken([
  {
    token: " days",
    type: 7,
    show: "days",
    precedence: 0,
    value: (a: number) => {
      return a * 86400;
    },
  },
  {
    token: " weeks",
    type: 7,
    show: "weeks",
    precedence: 0,
    value: (a: number) => {
      return a * 7 * 86400;
    },
  },
  {
    token: " months",
    type: 7,
    show: "months",
    precedence: 0,
    value: (a: number) => {
      return a * 30.44 * 86400;
    },
  },
  {
    token: " years",
    type: 7,
    show: "years",
    precedence: 0,
    value: (a: number) => {
      return a * 365.25 * 86400;
    },
  },
  {
    token: "_days",
    type: 7,
    show: "days",
    precedence: 0,
    value: (a: number) => {
      return a * 86400;
    },
  },
  {
    token: "_weeks",
    type: 7,
    show: "weeks",
    precedence: 0,
    value: (a: number) => {
      return a * 7 * 86400;
    },
  },
  {
    token: "_months",
    type: 7,
    show: "months",
    precedence: 0,
    value: (a: number) => {
      return a * 30.44 * 86400;
    },
  },
  {
    token: "_years",
    type: 7,
    show: "years",
    precedence: 0,
    value: (a: number) => {
      return a * 365.25 * 86400;
    },
  },
  {
    token: "days",
    type: 7,
    show: "days",
    precedence: 0,
    value: (a: number) => {
      return a * 86400;
    },
  },
  {
    token: "weeks",
    type: 7,
    show: "weeks",
    precedence: 0,
    value: (a: number) => {
      return a * 7 * 86400;
    },
  },
  {
    token: "months",
    type: 7,
    show: "months",
    precedence: 0,
    value: (a: number) => {
      return a * 30.44 * 86400;
    },
  },
  {
    token: "years",
    type: 7,
    show: "years",
    precedence: 0,
    value: (a: number) => {
      return a * 365.25 * 86400;
    },
  },
]);
