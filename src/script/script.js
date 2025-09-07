const $ = window.$
$(document).ready(() => {
  let currentExpression = ""
  let lastaddCharacter = ""

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

  function isDigit(character) {
    return character >= "0" && character <= "9"
  }

  function isOperator(character) {
    if (character === "+") return true
    if (character === "-") return true
    if (character === "*") return true
    if (character === "/") return true
    if (character === "^") return true
    return false
  }
  
  function toggleSign() {
    if (currentExpression === "") {
      return 
    }

    let lastNumberStart = -1
    const lastNumberEnd = currentExpression.length - 1

    if (!isDigit(currentExpression[lastNumberEnd])) {
      return 
    }

    for (let i = lastNumberEnd; i >= 0; i--) {
      if (isDigit(currentExpression[i])) {
        lastNumberStart = i
      } else {
        break
      }
    }

    if (lastNumberStart === -1) {
      return 
    }

    let numberStr = ""
    for (let i = lastNumberStart; i <= lastNumberEnd; i++) {
      numberStr += currentExpression[i]
    }

    let hasNegativeSign = false
    if (lastNumberStart > 0 && currentExpression[lastNumberStart - 1] === "-") {
   
      if (
        lastNumberStart === 1 ||
        isOperator(currentExpression[lastNumberStart - 2]) ||
        currentExpression[lastNumberStart - 2] === "("
      ) {
        hasNegativeSign = true
        lastNumberStart-- 
      }
    }

    let newExpression = ""

    for (let i = 0; i < lastNumberStart; i++) {
      newExpression += currentExpression[i]
    }

    // Add the toggled number
    if (hasNegativeSign) {
      // Remove the negative sign (make positive)
      for (let i = lastNumberStart + 1; i <= lastNumberEnd; i++) {
        newExpression += currentExpression[i]
      }
    } else {
      // Add negative sign (make negative)
      newExpression += "-" + numberStr
    }

    currentExpression = newExpression
    updateDisplay()
  }

  //order of operations or prio list
  function prec(op) {
    if (op === "^") return 3
    if (op === "*" || op === "/") return 2
    if (op === "+" || op === "-") return 1
    return -1
  }
  
  function infixToPostfix(infixExpression) {
    
    let operatorStack = ""
    let stackSize = 0
    let resultExpression = ""


    function stackPush(item) {
      operatorStack += item
      stackSize++
    }

    function stackPop() {
      if (stackSize === 0) return ""
      const lastItem = operatorStack[stackSize - 1]
      operatorStack = operatorStack.substring(0, stackSize - 1)
      stackSize--
      return lastItem
    }

    function stackTop() {
      if (stackSize === 0) return ""
      return operatorStack[stackSize - 1]
    }

    function stackIsEmpty() {
      return stackSize === 0
    }

   
    let expressionLength = 0
    for (let i = 0; infixExpression[i] !== undefined; i++) {
      expressionLength++
    }

    for (let index = 0; index < expressionLength; index++) {
      const currentCharacter = infixExpression[index]

      if (isAlphanumeric(currentCharacter)) {
        resultExpression += currentCharacter
      } else if (currentCharacter === "(") {
        stackPush("(")
      } else if (currentCharacter === ")") {
        while (!stackIsEmpty() && stackTop() !== "(") {
          resultExpression += stackPop()
        }
        stackPop() 
      } else {
        while (!stackIsEmpty() && prec(currentCharacter) <= prec(stackTop())) {
          resultExpression += stackPop()
        }
        stackPush(currentCharacter)
      }
    }

    while (!stackIsEmpty()) {
      resultExpression += stackPop()
    }

    return resultExpression
  }
  function updateDisplay() {
    $("#currentExpression").text(currentExpression || "Enter expression...")

    $("#inputtext").val(currentExpression)
  }
function addChar(char) {
    if (currentExpression === "" && isOperator(char) && char !== "-") {
      return 
    }

    if (isOperator(char)) {
      
      if (currentExpression.length > 0 && isOperator(currentExpression[currentExpression.length - 1])) {
        if (char === lastaddCharacter) {

          return
        } else {
          currentExpression = currentExpression.slice(0, -1) 
        }
      }
    }

    currentExpression += char
    lastaddCharacter = char
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

  $("#Clear").click(() => {
    currentExpression = ""
    updateDisplay()
    $("#postfixResult").text("")
    $("#postfixconversion").val("")
    $("#total").val("")
  })
  $("#toggleSign").click(() => {
    toggleSign()
  })

  $("#convert").click(() => {
    const result = infixToPostfix(currentExpression)
    $("#postfixResult").text(result)
    $("#postfixconversion").val(result)
  })

  $(document).keydown((event) => {
    const key = event.key

    if (key >= "0" && key <= "9") {
      addChar(key)
      event.preventDefault()
    } else if (key === "+") {
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
    } else if (key === "Enter") {
      const result = infixToPostfix(currentExpression)
      $("#postfixResult").text(result)
      $("#postfixconversion").val(result)
      event.preventDefault()
    } else if (key === "Escape" || key === "Delete") {
      currentExpression = ""
      updateDisplay()
      $("#postfixResult").text("")
      $("#postfixconversion").val("")
      $("#total").val("")
      event.preventDefault()
    } else if (key === "Backspace") {
      let newExpression = ""
      let expressionLength = 0

     
      for (let i = 0; currentExpression[i] !== undefined; i++) {
        expressionLength++
      }

      for (let i = 0; i < expressionLength - 1; i++) {
        newExpression += currentExpression[i]
      }

      currentExpression = newExpression
      updateDisplay()
      event.preventDefault()
    }

  })
})
