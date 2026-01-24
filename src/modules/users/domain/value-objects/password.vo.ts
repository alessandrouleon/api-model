export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,80}$/;


export const PASSWORD_INVALID_MESSAGE =
  'A senha deve conter pelo menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial.';
