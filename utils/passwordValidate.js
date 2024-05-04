export default function password_validate(password) {
    var re = {
        'capital' : /[A-Z]/,
        'digit'   : /[0-9]/,
        'full'    : /^[A-Za-z0-9]{8,}$/
    };
    const atLeastOneCaps = re.capital.test(password)
    const atLeastOneDigit = re.digit.test(password)
    const lengthCheck = re.full.test(password)
    return {
        capital: atLeastOneCaps,
        digit: atLeastOneDigit,
        length: lengthCheck,
        state: atLeastOneCaps && atLeastOneDigit && lengthCheck
    }
}