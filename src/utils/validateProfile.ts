export interface ProfileFormErrors {
  fullname?: string;
  nickname?: string;
  email?: string;
  birthDate?: string;
  bio?: string;
  location?: string;
}

interface ProfileFormData {
  fullname: string;
  nickname: string;
  email: string;
  birthDate: string;
  bio?: string;
  location?: string;
}

export function validateProfileForm(data: ProfileFormData): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!data.fullname || data.fullname.trim().length < 5) {
    errors.fullname = "El nombre completo debe tener al menos 5 caracteres";
  } else if (data.fullname.length > 30) {
    errors.fullname = "El nombre completo no puede superar los 30 caracteres";
  }

  if (!data.nickname || data.nickname.trim().length < 5) {
    errors.nickname = "El nickname debe tener al menos 5 caracteres";
  } else if (data.nickname.length > 20) {
    errors.nickname = "El nickname no puede superar los 20 caracteres";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (!data.birthDate) {
    errors.birthDate = "La fecha de nacimiento es obligatoria";
  }

  if (data.bio && data.bio.length > 200) {
    errors.bio = "La biografía no puede superar los 200 caracteres";
  }

  if (data.location && data.location.length > 100) {
    errors.location = "La ubicación no puede superar los 100 caracteres";
  }

  return errors;
}
