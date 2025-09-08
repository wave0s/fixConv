const $ = window.$
        $(document).ready(() => {
            let currentExpression = ""
            let lastaddCharacter = ""

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

                if (hasNegativeSign) {
                    for (let i = lastNumberStart + 1; i <= lastNumberEnd; i++) {
                        newExpression += currentExpression[i]
                    }
                } else {
                    newExpression += "-" + numberStr
                }

                currentExpression = newExpression
                updateDisplay()
            }

            function prec(op) {
                if (op === "^") return 3
                if (op === "*" || op === "/") return 2
                if (op === "+" || op === "-") return 1
                return -1
            }
            
            function infixToPostfix(infixExpression) {
    // First process negative expressions
             const processedExpression = handleNegativeExpressions(infixExpression);
    
  
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

                // Add spaces between numbers and operators for proper parsing
                let spacedExpression = ""
                for (let index = 0; index < expressionLength; index++) {
                    const currentCharacter = infixExpression[index]
                    
                    if (isAlphanumeric(currentCharacter)) {
                        spacedExpression += currentCharacter
                    } else {
                        // Add spaces around operators and parentheses
                        if (spacedExpression.length > 0 && spacedExpression[spacedExpression.length - 1] !== " ") {
                            spacedExpression += " "
                        }
                        spacedExpression += currentCharacter
                        if (index < expressionLength - 1) {
                            spacedExpression += " "
                        }
                    }
                }

                // Now process the spaced expression
                const tokens = spacedExpression.split(' ').filter(token => token !== '')
                
                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i]
                    
                    if (isAlphanumeric(token[0]) || (token.length > 1 && token[0] === '-' && isDigit(token[1]))) {
                        // It's a number (including negative numbers)
                        resultExpression += (resultExpression ? " " : "") + token
                    } else if (token === "(") {
                        stackPush("(")
                    } else if (token === ")") {
                        while (!stackIsEmpty() && stackTop() !== "(") {
                            resultExpression += " " + stackPop()
                        }
                        stackPop() 
                    } else if (isOperator(token)) {
                        while (!stackIsEmpty() && stackTop() !== "(" && prec(token) <= prec(stackTop())) {
                            resultExpression += " " + stackPop()
                        }
                        stackPush(token)
                    }
                }

                while (!stackIsEmpty()) {
                    resultExpression += " " + stackPop()
                }

                return resultExpression.trim()
            }

            function evaluatePostfix(postfixExpression) {
                const stack = []
                const tokens = postfixExpression.split(' ').filter(token => token !== '')

                function isNumeric(str) {
                    if (str.length === 0) return false
                    let start = 0
                    if (str[0] === '-') {
                        if (str.length === 1) return false
                        start = 1
                    }
                    for (let i = start; i < str.length; i++) {
                        if (str[i] < '0' || str[i] > '9') {
                            return false
                        }
                    }
                    return true
                }

                function toNumber(str) {
                    return parseInt(str, 10)
                }

                function power(base, exponent) {
                    if (exponent === 0) return 1
                    if (exponent < 0) return 0
                    let result = 1
                    for (let i = 0; i < exponent; i++) {
                        result *= base
                    }
                    return result
                }
                function integerDivide(a, b) {

                        if (b === 0) return "Error" 

                        let quotient = 0

                        let remainder = absolute(a)

                        const divisor = absolute(b)

                        while (remainder >= divisor) {

                          remainder -= divisor

                          quotient++

                        }


                        if ((a < 0 && b > 0) || (a > 0 && b < 0)) {

                          quotient = -quotient

                        }

                        return quotient

                      }



                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i]

                    if (isNumeric(token)) {
                        stack.push(toNumber(token))
                    } else if (token.length === 1 && isOperator(token)) {
                        if (stack.length < 2) return "Error"

                        const b = stack.pop()
                        const a = stack.pop()
                        let result = 0

                        if (token === '+') {
                            result = a + b
                        } else if (token === '-') {
                            result = a - b
                        } else if (token === '*') {
                            result = a * b
                        } else if (token === '/') {
                            if (b === 0) return "Error"

                          const divResult = integerDivide(a, b)
                          if (divResult === "Error") return "Error"
                          result = divResult
                        } else if (token === '^') {
                            result = power(a, b)
                        } else {
                            return "Error"
                        }

                        stack.push(result)
                    } else {
                        return "Error"
                    }
                }

                if (stack.length !== 1) return "Error"
                return stack[0]
            }

            function updateDisplay() {
                $("#inputtext").val(currentExpression)
            }
                      function handleNegativeExpressions(expression) {
                    let result = "";
                    let i = 0;
                    const length = expression.length;
                    
                    // Helper function to check if a character is an operator
                    function isOp(char) {
                        return char === '+' || char === '-' || char === '*' || char === '/' || char === '^';
                    }
                    
                    // Helper function to check if a character is a digit
                    function isDigit(char) {
                        return char >= "0" && char <= "9";
                    }
                    
                    while (i < length) {
                        const currentChar = expression[i];
                        
                        // Check if this is a negative sign (not a subtraction)
                        if (currentChar === '-' && 
                            (i === 0 || expression[i-1] === '(' || isOp(expression[i-1]))) {
                            
                            // This is a negative sign, not subtraction
                            result += '-';
                            i++;
                            
                            // Handle the number after the negative sign
                            while (i < length && isDigit(expression[i])) {
                                result += expression[i];
                                i++;
                            }
                        } else {
                            // Regular character, just add it
                            result += currentChar;
                            i++;
                        }
                    }
                    
                    return result;
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

            // Button event handlers
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
                $("#postfixconversion").val("")
                $("#total").val("")
            })

            $("#toggleSign").click(() => {
                toggleSign()
            })

            $("#convert").click(() => {
                if (currentExpression === "") {
                    $("#postfixconversion").val("Enter an expression first")
                    $("#total").val("")
                    return
                }

                const result = infixToPostfix(currentExpression)
                $("#postfixconversion").val(result)

                const total = evaluatePostfix(result)
                $("#total").val(total)
            })

            // Keyboard support
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
                    $("#convert").click()
                    event.preventDefault()
                } else if (key === "Escape" || key === "Delete") {
                    $("#Clear").click()
                    event.preventDefault()
                } else if (key === "Backspace") {
                    if (currentExpression.length > 0) {
                        currentExpression = currentExpression.slice(0, -1)
                        updateDisplay()
                    }
                    event.preventDefault()
                }
            })


            updateDisplay()
        })