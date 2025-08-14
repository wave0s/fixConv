
const $ = window.$

$(document).ready(() => {
  let currentExpression = ""

/// checks if the elem in user's expressions is valid
  function isAlphanumeric(character) {
    if (character >= "0" && character <= "9") {
      return true
    }
    if (character >= "A" && character <= "Z") {
      return true
    }
    if (character >= "a" && character <= "z") {
      return true
    }
    return false
  }

//smwhatorder of operations
  function prec(op) {
    if (op === "^") return 3
    if (op === "*" || op === "/") return 2
    if (op === "+" || op === "-") return 1
    return -1
  }

  function infixToPostfix(infixExpression) {
    const operatorStack = []
    let resultExpression = ""

    for (let index = 0; index < infixExpression.length; index++) { //scans the char of userinput expression
      const currentCharacter = infixExpression[index]

      if (isAlphanumeric(currentCharacter)) { /// checks if the elem in user's input expression is valid
        resultExpression += currentCharacter /// and if so, addit tithe output expression
      } else if (currentCharacter === "(") { // If the scanned char is an ( push it to the stack.
        operatorStack.push("(")
      } else if (currentCharacter === ")") { // If the scanned char is an )
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") { // Till it does not encounter an open parenthesis
          resultExpression += operatorStack.pop() // pop and add to the output string from the stack
        }
        operatorStack.pop()
      } else {
        while (operatorStack.length && prec(currentCharacter) <= prec(operatorStack[operatorStack.length - 1])) {   // If an operator is scanned
          resultExpression += operatorStack.pop()
        }
        operatorStack.push(currentCharacter)
      }
    }
    // Pop all the remaining elem in the given expresultExpressionsio n
    while (operatorStack.length) {
      resultExpression += operatorStack.pop()
    }

    return resultExpression
  }

  function updateDisplay() {
    $("#currentExpression").text(currentExpression || "Enter expression...")
  }

  function addChar(char) {
    currentExpression += char
    updateDisplay()
  }
// input ot dsiplay
  $("#plus").click(() => addChar("+"))
  $("#minus").click(() => addChar("-"))
  $("#multiply").click(() => addChar("*"))
  $("#divide").click(() => addChar("/"))
  $("#power").click(() => addChar("^"))
  $("#openParen").click(() => addChar("("))
  $("#closeParen").click(() => addChar(")"))

  
  $("#0").click(() => addChar("0"))
  $("#1").click(() => addChar("1"))
  $("#2").click(() => addChar("2"))
  $("#3").click(() => addChar("3"))
  $("#4").click(() => addChar("4"))
  $("#5").click(() => addChar("5"))
  $("#6").click(() => addChar("6"))
  $("#7").click(() => addChar("7"))
  $("#8").click(() => addChar("8"))
  $("#9").click(() => addChar("9"))

  $("#clear").click(() => {
    currentExpression = ""
    updateDisplay()
    $("#postfixResult").text("")
  })

  $("#convert").click(() => {
    $("#postfixResult").text(infixToPostfix(currentExpression))
  })

  $(document).keydown((event) => {
    const key = event.key

   
    if (key >= "0" && key <= "9") {
      addChar(key)
      event.preventDefault()
    }
   
    else if (key === "+") {
      addChar("+")
      event.preventDefault()
    } else if (key === "-") {
      addChar("-")
      event.preventDefault()
    } else if (key === "*") {
      addChar("*")
      event.preventDefault()
    } else if (key === "/") {
      addChar("/")
      event.preventDefault()
    } else if (key === "^") {
      addChar("^")
      event.preventDefault()
    } else if (key === "(") {
      addChar("(")
      event.preventDefault()
    } else if (key === ")") {
      addChar(")")
      event.preventDefault()
    }
   
    else if (key === "Enter") {
      $("#postfixResult").text(infixToPostfix(currentExpression))
      event.preventDefault()
    }
  
    else if (key === "Escape" || key === "Delete") {
      currentExpression = ""
      updateDisplay()
      $("#postfixResult").text("")
      event.preventDefault()
    }
   
    else if (key === "Backspace") {
      currentExpression = currentExpression.slice(0, -1)
      updateDisplay()
      event.preventDefault()
    }
  })
})
