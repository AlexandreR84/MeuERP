function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function isRepeatedDigits(value) {
  return /^(\d)\1+$/.test(value);
}

function validarCpf(cpf) {
  const digits = onlyDigits(cpf);

  if (digits.length !== 11 || isRepeatedDigits(digits)) {
    return false;
  }

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(digits[index]) * (10 - index);
  }

  let resto = (sum * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }

  if (resto !== Number(digits[9])) {
    return false;
  }

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * (11 - index);
  }

  resto = (sum * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }

  return resto === Number(digits[10]);
}

function validarCnpj(cnpj) {
  const digits = onlyDigits(cnpj);

  if (digits.length !== 14 || isRepeatedDigits(digits)) {
    return false;
  }

  const calcularDigito = (base, weights) => {
    const total = base
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * weights[index], 0);
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiro = calcularDigito(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = calcularDigito(digits.slice(0, 12) + primeiro, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return digits.endsWith(`${primeiro}${segundo}`);
}

module.exports = {
  onlyDigits,
  validarCpf,
  validarCnpj
};
