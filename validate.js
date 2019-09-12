/**
 * ******************************************** VALIDATE.JS FILE  ********************************************
 * **                                                                                                       **
 * ** @description  This file contains the Documents Validation Function.                                   **
 * **                                                                                                       **
 * ** @author       Gustavo G. Pires                                                                        **
 * **                                                                                                       **
 * ** @see          https://github.com/GuhPires                                                             **
 * **                                                                                                       **
 * ***********************************************************************************************************
 **/

const Validate = {
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
 * @see           https://github.com/GuhPires/documents-validator
 * 
 */
  validateCPF: (digits) => {
    if (digits.length != 11 || digits == '1'.repeat(11) || digits == '2'.repeat(11) || digits == '3'.repeat(11) || digits == '4'.repeat(11) || digits == '5'.repeat(11) ||
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
  },

  /**
  * 
  * @description   Verify if the provided CNPJ is valid.
  * 
  * @param         {string} digits - Provided CNPJ digits
  * 
  *                A B . C D E . F G H / I J K L - M N
  *                | |   | | |   | | |   | | | |   | |-> 2nd Checking Digit
  *                | |   | | |   | | |   | | | |   |-> 1st Cheking Digit
  *                |------- INI. DIGITS -------|
  * 
  *                General Rules:
  *                - Initial M: (Ax5 + Bx4 + Cx3 + Dx2 + Ex9 + Fx8 + Gx7 + Hx6 + Ix5 + Jx4 + Kx3 + Lx2) % 11 = M (1st Checking Digit);
  *                - Initial N: (Ax6 + Bx5 + Cx4 + Dx3 + Ex2 + Fx9 + Gx8 + Hx7 + Ix6 + Jx5 + Kx4 + Lx3 + Mx2) % 11 = N (2nd Checking Digit);
  *                - Final M: M < 2 ? M = 0 : 11 - Initial M;
  *                - Final N: N < 2 ? N = 0 : 11 - Initial N;
  * 
  * @author        Gustavo G. Pires
  * 
  * @see           https://github.com/GuhPires/documents-validator
  * 
**/
  validateCNPJ: (digits) => {
    if (digits.length != 14 || digits == '1'.repeat(14) || digits == '2'.repeat(14) || digits == '3'.repeat(14) || digits == '4'.repeat(14) || digits == '5'.repeat(14) ||
      digits == '6'.repeat(14) || digits == '7'.repeat(14) || digits == '8'.repeat(14) || digits == '9'.repeat(14)) {
      return false;
    }

    const iniDigits = digits.split('');
    iniDigits.splice(-2);

    const verify = (iniArr) => {
      let multiplier = iniArr.length == 12 ? 6 : 7;
      const result = iniArr.reduce((acc, currValue) => {
        multiplier--;
        if (multiplier == 1) multiplier = 9;
        return parseInt(acc) + (parseInt(currValue) * (multiplier));
      }, 0);

      return result % 11;
    }

    const initM = verify(iniDigits);
    let M = initM >= 2 ? 11 - initM : 0;
    iniDigits.push(M);
    const initN = verify(iniDigits);
    let N = initN >= 2 ? 11 - initN : 0;

    if (parseInt(digits.charAt(digits.length - 1)) === N && parseInt(digits.charAt(digits.length - 2)) === M) {
      return true;
    }
    return false;
  }
}

// CPF TESTING:
console.log('Valid CPF: ', Validate.validateCPF('54156049019'));  // Valid: true;
console.log('Valid CPF: ', Validate.validateCPF('18440985088'));  // Valid: true;
console.log('Valid CPF: ', Validate.validateCPF('76746127087'));  // Valid: true;
console.log('Valid CPF: ', Validate.validateCPF('89027830062'));  // Valid: false;
console.log('Valid CPF: ', Validate.validateCPF('08988487031'));  // Valid: false;
console.log('Valid CPF: ', Validate.validateCPF('64574203032'));  // Valid: false;
console.log('Valid CPF: ', Validate.validateCPF('11111111111'));  // Valid: false;
console.log('Valid CPF: ', Validate.validateCPF('0000000000'));   // Valid: false;

// CNPJ TESTING:
console.log('Valid CNPJ: ', Validate.validateCNPJ('32609453000106'));  // Valid: true;
console.log('Valid CNPJ: ', Validate.validateCNPJ('90880788000160'));  // Valid: true;
console.log('Valid CNPJ: ', Validate.validateCNPJ('56878092000161'));  // Valid: true;
console.log('Valid CNPJ: ', Validate.validateCNPJ('47102248001127'));  // Valid: false;
console.log('Valid CNPJ: ', Validate.validateCNPJ('74495872000102'));  // Valid: false;
console.log('Valid CNPJ: ', Validate.validateCNPJ('91840023000163'));  // Valid: false;
console.log('Valid CNPJ: ', Validate.validateCNPJ('11111111111111'));  // Valid: false;
console.log('Valid CNPJ: ', Validate.validateCNPJ('0000000000000'));   // Valid: false;
