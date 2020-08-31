const numBtn = document.querySelectorAll("[data-number]");
const opBtn = document.querySelectorAll("[data-op]");
const equalsBtn = document.querySelector("[data-equals]");
const clearBtn = document.querySelector("[data-clear]");
const minusBtn = document.querySelector("[data-minus]");
const percentageBtn = document.querySelector("[data-percentage]");
let previousTextElement = document.querySelector("[data-previous]");
let inputTextElement = document.querySelector("[data-input]");
let opPressed = false;
let numPressed = false;

let a = "";
let op = "";
let b = "";

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operator(a, operator, b) {
  let result;

  switch (operator) {
    case "+":
      result = add(a, b);
      break;
    case "-":
      result = subtract(a, b);
      break;
    case "x":
      result = multiply(a, b);
      break;
    case "÷":
      result = divide(a, b);
      break;
  }
  result = simplifyNum(result);
  return result;
}

function simplifyNum(num) {
  num = num.toString();
  let decimalIndex = num.indexOf(".");
  if (decimalIndex >= 0) {
    let expIndex = num.indexOf("e");
    if (Number(num) > 999999999) {
      num = Number(num).toExponential();
      if (decimalIndex > 0 && expIndex > 3) {
        let num1 = num.split("").splice(0, decimalIndex + 3);
        let num2 = num.split("").splice(expIndex);
        num = num1.concat(num2).join("");
      }
      return num;
    } else if (num < 999999999 && decimalIndex > 0) {
      num = Number(num).toFixed(2);
    }
    return num;
  } else {
    return (num = Number(num));
  }
}

numBtn.forEach((button) =>
  button.addEventListener("click", () => {
    equalsBtn.classList.remove("pressed");
    button.classList.add("num");
    if (opPressed && numPressed === false) {
      inputTextElement.value = "";
      numPressed = true;
    }
    if (inputTextElement.value.length < 9) {
      if (inputTextElement.value === "0" && button.innerText !== ".") {
        inputTextElement.value = +button.innerText;
      } else if (button.innerText === ".") {
        if (inputTextElement.value.indexOf(".") < 0) {
          inputTextElement.value += button.innerText;
        }
      } else if (inputTextElement.value === "-0") {
        let arr = inputTextElement.value.split("");
        arr[1] = button.innerText;
        arr.toString();
        inputTextElement.value = arr.join("");
      } else {
        inputTextElement.value += button.innerText;
      }
    }
    if (inputTextElement.value !== "0") {
      clearBtn.textContent = "C";
    }
  })
);

numBtn.forEach((button) =>
  button.addEventListener("transitionend", () => {
    button.classList.remove("num");
  })
);

opBtn.forEach((button) =>
  button.addEventListener("click", () => {
    removeClass();
    button.classList.remove("notpressed");
    button.classList.add("pressed");
    if (previousTextElement.textContent !== "" && numPressed) {
      a = Number(previousTextElement.textContent);
      b = Number(inputTextElement.value);
      inputTextElement.value = simplifyNum(operator(a, op, b));
      previousTextElement.textContent = simplifyNum(inputTextElement.value);
    }
    a = Number(inputTextElement.value);
    previousTextElement.textContent = a;
    op = button.innerText;
    opPressed = true;
    numPressed = false;
  })
);

equalsBtn.addEventListener("click", () => {
  removeClass();
  equalsBtn.classList.add("pressed");
  if (op === "") {
    return;
  } else {
    if (numPressed === false) {
      a = Number(inputTextElement.value);
    } else if (numPressed) {
      b = Number(inputTextElement.value);
    }
    inputTextElement.value = simplifyNum(operator(a, op, b));
    previousTextElement.textContent = simplifyNum(inputTextElement.value);
  }
  opPressed = true;
  numPressed = false;
});

percentageBtn.addEventListener("click", () => {
  removeClass();
  percentageBtn.classList.add("pressed");
  if (op === "") {
    inputTextElement.value = Number(inputTextElement.value) / 100;
  } else {
    b = Number(inputTextElement.value);
    inputTextElement.value = a + (a / 100) * b;
    b = (a / 100) * b;
  }
  opPressed = true;
  numPressed = false;
});

function removeClass() {
  for (let i = 0; i < opBtn.length; i++) {
    if (opBtn[i].classList.contains("pressed")) {
      opBtn[i].classList.remove("pressed");
    }
  }
  percentageBtn.classList.remove("pressed");
  equalsBtn.classList.remove("pressed");
}

window.onkeydown = function (e) {
  let digits = "1234567890.";
  let operators = "-+÷x";
  let otherMultiply = "X*";
  let otherDiv = "/";
  let percentage = "%";
  let clear = "Cc";

  //STOP SELECTION OF INPUT AND ENTERING INVALID INFOMATION
  if (e.code != "ArrowLeft" && e.code != "ArrowRight") {
    e.preventDefault();
  } else {
    inputTextElement.focus();
  }

  //NUMBERS
  if (digits.includes(e.key)) {
    for (let i = 0; i < numBtn.length; i++) {
      if (numBtn[i].innerText == e.key) {
        numBtn[i].classList.add("num");
      }
    }

    if (opPressed && numPressed === false) {
      inputTextElement.value = "";
      numPressed = true;
    }
    if (inputTextElement.value.length < 9) {
      if (inputTextElement.value === "0" && e.key !== ".") {
        inputTextElement.value = +e.key;
      } else if (e.key === ".") {
        if (inputTextElement.value.indexOf(".") < 0) {
          inputTextElement.value += e.key;
        }
      } else if (inputTextElement.value === "-0") {
        let arr = inputTextElement.value.split("");
        arr[1] = e.key;
        arr.toString();
        inputTextElement.value = arr.join("");
      } else {
        inputTextElement.value += e.key;
      }
    }
    if (inputTextElement.value !== "0") {
      clearBtn.textContent = "C";
    }
  }

  // DELETE
  if (e.key == "Backspace" || e.key == "Delete") {
    inputTextElement.value = inputTextElement.value.slice(0, -1);
    if (inputTextElement.value === "") {
      inputTextElement.value = 0;
    }
  }

  //EQUALS
  if (e.key == "=" || e.key == "Enter") {
    removeClass();
    equalsBtn.classList.add("pressed");
    if (op === "") {
      return;
    } else {
      if (numPressed === false) {
        a = Number(inputTextElement.value);
      } else if (numPressed) {
        b = Number(inputTextElement.value);
      }
      inputTextElement.value = operator(a, op, b);
      previousTextElement.textContent = simplifyNum(inputTextElement.value);
    }
    opPressed = true;
    numPressed = false;
  }

  //OPERATORS
  if (
    operators.includes(e.key) ||
    otherMultiply.includes(e.key) ||
    otherDiv.includes(e.key)
  ) {
    removeClass();
    if (previousTextElement.textContent !== "" && numPressed) {
      a = Number(previousTextElement.textContent);
      b = Number(inputTextElement.value);
      inputTextElement.value = operator(a, op, b);
      previousTextElement.textContent = simplifyNum(inputTextElement.value);
    }
    a = Number(inputTextElement.value);
    previousTextElement.textContent = a;
    if (otherMultiply.includes(e.key)) {
      op = "x";
    } else if (otherDiv.includes(e.key)) {
      op = "÷";
    } else {
      op = e.key;
    }
    for (let i = 0; i < opBtn.length; i++) {
      if (opBtn[i].innerText == op) {
        opBtn[i].classList.remove("notpressed");
        opBtn[i].classList.add("pressed");
      }
    }
    opPressed = true;
    numPressed = false;
  }

  //PERCENTAGE
  if (percentage.includes(e.key)) {
    removeClass();
    percentageBtn.classList.add("pressed");
    if (op === "") {
      inputTextElement.value = Number(inputTextElement.value) / 100;
    } else {
      b = Number(inputTextElement.value);
      inputTextElement.value = a + (a / 100) * b;
      b = (a / 100) * b;
    }
    opPressed = true;
    numPressed = false;
  }

  //ALLCLEAR
  if (clear.includes(e.key)) {
    inputTextElement.value = "0";
    previousTextElement.textContent = "";
    clearBtn.textContent = "AC";
    removeClass();
    a = "";
    op = "";
    b = "";
  }
};

minusBtn.addEventListener("click", () => {
  if (inputTextElement.value[0] !== "-") {
    let arr = inputTextElement.value.split("");
    arr.unshift("-").toString();
    inputTextElement.value = arr.join("");
  } else if (inputTextElement.value[0] === "-") {
    let arr = inputTextElement.value.split("");
    arr.shift().toString();
    inputTextElement.value = arr.join("");
  }
});

clearBtn.addEventListener("click", () => {
  inputTextElement.value = "0";
  previousTextElement.textContent = "";
  clearBtn.textContent = "AC";
  removeClass();
  a = "";
  op = "";
  b = "";
});

inputTextElement.addEventListener("change", () => {
  clearBtn.textContent = "C";
});
