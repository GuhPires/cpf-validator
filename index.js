/**
 *          -- Documents Validator --
 *
 * @description  Set of helper functions that verify the validity
 *               of a given CPF or CNPJ
 *
 * @author       GuhPires<gustavo.goncalvespires@gmail.com>
 *
 * @see          https://github.com/GuhPires/documents-validator
 *
 **/

// TODO: add description to docs instead
/**
 *  validateCPF `function`
 *
 * @description   Verify if the provided CPF is valid
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
 **/
/**
 *
 * validateCNPJ `function`
 * @description   Verify if the provided CNPJ is valid
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
 **/

const prv = {
	_validate: Symbol('_validate'),
	_verify: Symbol('_verify'),
	_checker: Symbol('_checker'),
	CPF: Symbol('CPF'),
	CNPJ: Symbol('CNPJ'),
};

const invalid = [
	'000.000.000-00',
	'111.111.111-11',
	'222.222.222-22',
	'333.333.333-33',
	'444.444.444-44',
	'555.555.555-55',
	'666.666.666-66',
	'777.777.777-77',
	'888.888.888-88',
	'999.999.999-99',
	'00.000.000/0000-00',
];

class Validator {
	[prv._validate](digits) {
		const dig = '' + digits;
		const len = dig.length;

		if (len !== 14 && len !== 18) return false;

		const rgx = /^(?<initial>\d{2,3}\.\d{3}\.\d{3}(\/\d{4})?)-(?<final>\d{2})$/;
		const valid = dig.match(rgx);

		if (!valid || invalid.includes(dig)) return false;

		const { initial, final } = valid.groups;
		const type = len === 14 ? prv.CPF : prv.CNPJ;

		return { initial: initial.replace(/\D/g, ''), final, type };
	}

	[prv._verify](numsArr, check) {
		let multiplier = numsArr.length + 1;

		if (numsArr.length > 11) multiplier -= 8;

		const reducer = (prev, curr) => {
			const num = +curr;
			const result = prev + num * multiplier;

			multiplier--;

			if (multiplier === 1) multiplier = 9;

			return result;
		};

		const sum = numsArr.reduce(reducer, 0);
		const remainder = (sum * 10) % 11;
		const value = remainder === 10 ? 0 : remainder;

		return value === +check;
	}

	[prv._checker](parsed) {
		const { initial, final } = parsed;

		const nums = Array.from(initial);
		const check = Array.from(final);

		for (let i = 0; i < 2; i++) {
			if (i > 0) nums.push(check[i - 1]);

			const verified = this[prv._verify](nums, check[i]);
			if (!verified) return false;
		}

		return true;
	}

	CPF(digits) {
		const valid = this[prv._validate](digits);

		if (!valid || valid.type !== prv.CPF) return false;

		return this[prv._checker](valid);
	}

	CNPJ(digits) {
		const valid = this[prv._validate](digits);

		if (!valid || valid.type !== prv.CNPJ) return false;

		return this[prv._checker](valid);
	}

	// TODO: finsih this function
	validate(digits, type) {
		if (!type) type = 'CPF';

		// TODO: check for invalid type param

		return this[type.toUpperCase()](digits);
	}
}

module.exports = new Validator();
