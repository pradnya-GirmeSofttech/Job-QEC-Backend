import passwordGenerator from "generate-password";

export const generatePassword = () => {
  const options = {
    length: 12, // Change the length as needed
    numbers: true,
    symbols: false,
    uppercase: true,
    strict: true,
  };

  // Generate a random password
  return passwordGenerator.generate(options);
};
