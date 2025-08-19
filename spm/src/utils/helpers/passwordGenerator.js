import { generatePassword } from '../../utils/helpers/passwordGenerator';

export function PasswordGeneratorComponent() {
  const [password, setPassword] = useState('');

  return (
    <div>
      <button type="button" onClick={() => setPassword(generatePassword())}>
        Generate Strong Password
      </button>
      {password && <p>Your new password is: {password}</p>}
    </div>
  );
}