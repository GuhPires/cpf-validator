/**
 * ************************************************************* VALIDATE.JS FILE **********************************************************************
 * **                                                                                                                                                 **
 * ** @description  This file contains the CPF Validation Function.                                                                                   **
 * **                                                                                                                                                 **
 * ** @author       Gustavo G. Pires                                                                                                                  **
 * **                                                                                                                                                 **
 * ** @see          https://github.com/guhpires                                                                                                       **
 * **                                                                                                                                                 **
 * *****************************************************************************************************************************************************
 **/

/**
 * 
 * @description   Verify if the provided CPF is valid.
 * 
 * @param         {string} digits - Provided CPF digits
 * 
 *                A B C . D E F . G H I - J K
 *                | | |   | | |   | | |   | |-> 2nd Checking Digit
 *                | | |   | | |   | | |   |-> 1st Cheking Digit
 *                |--- INI. DIGITS ---|
 * 
 *                General Rules:
 *                - Initial J: (Ax10 + Bx9 + Cx8 + Dx7 + Ex6 + Fx5 + Gx4 + Hx3 + Ix2) % 11 = J (1st Checking Digit);
 *                - Initial K: (Ax11 + Bx10 + Cx9 + Dx8 + Ex7 + Fx6 + Gx5 + Hx4 + Ix3 + Jx2) % 11 = K (2nd Checking Digit);
 *                - Final J: J == 0 || J == 1 ? J = 0 : 11 - Initial J;
 *                - Final K: K == 0 || K == 1 ? K = 0 : 11 - Initial K;
 * 
 * @author        Gustavo G. Pires
 * 
 * @see           https://github.com/GuhPires/cpf-validator
 * 
 */
function validateCPF(digits) {
  if (digits == '1'.repeat(11) || digits == '2'.repeat(11) || digits == '3'.repeat(11) || digits == '4'.repeat(11) || digits == '5'.repeat(11) ||
    digits == '6'.repeat(11) || digits == '7'.repeat(11) || digits == '8'.repeat(11) || digits == '9'.repeat(11)) {
    return false;
  }

  const iniDigits = digits.split('');
  iniDigits.splice(-2);
  const verify = (iniArr) => {
    let num = iniArr.length + 1;
    const result = iniArr.reduce((acc, currValue, idx) => parseInt(acc) + (parseInt(currValue) * (num - idx)), 0);

    return result % 11;
  }

  const initJ = verify(iniDigits);
  let J = initJ > 1 ? 11 - initJ : 0;
  iniDigits.push(J);
  const initK = verify(iniDigits);
  let K = initK > 1 ? 11 - initK : 0;

  if (parseInt(digits.charAt(digits.length - 1)) === K && parseInt(digits.charAt(digits.length - 2)) === J) {
    return true;
  }
  return false;
}

console.log('Valid: ', validateCPF('54156049019'))  // Valid: true;
console.log('Valid: ', validateCPF('18440985088'))  // Valid: true;
console.log('Valid: ', validateCPF('76746127087'))  // Valid: true;
console.log('Valid: ', validateCPF('89027830062'))  // Valid: false;
console.log('Valid: ', validateCPF('08988487031'))  // Valid: false;
console.log('Valid: ', validateCPF('64574203032'))  // Valid: false;
