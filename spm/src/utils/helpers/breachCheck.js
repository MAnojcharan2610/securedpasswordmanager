import sha1 from 'js-sha1';

export async function isPasswordPwned(password) {
  const hash = sha1(password).toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  // Each line: HASH_SUFFIX:COUNT
  return text.split('\n').some(line => line.startsWith(suffix));
}