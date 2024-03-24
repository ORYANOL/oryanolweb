const toggleSwitch = document.getElementById('toggle-switch');
const lengthInput = document.getElementById('length-input');
const generateBtn = document.getElementById('generate-btn');
const generatedPassword = document.getElementById('generated-password');

let isRandomCharacters = true;

toggleSwitch.addEventListener('change', function() {
  isRandomCharacters = !isRandomCharacters;
});

generateBtn.addEventListener('click', function() {
  const length = lengthInput.value;
  let password = '';

  if (isRandomCharacters) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } else {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'peach', 'quince', 'raspberry', 'strawberry', 'tangerine', 'watermelon', 'zucchini'];
    for (let i = 0; i < length; i++) {
      password += words[Math.floor(Math.random() * words.length)];
      if (i !== length - 1) {
        password += '-';
      }
    }
  }

  generatedPassword.textContent = password;
});