import './compromised-passwords.styles.scss';

// Example compromised passwords data
const compromisedPasswords = [
  {
    service: 'Email',
    username: 'user@email.com',
    compromisedDate: '2024-11-10',
    status: 'Past',
  },
  {
    service: 'Bank',
    username: 'user@bank.com',
    compromisedDate: '2025-07-01',
    status: 'Future',
  },
  // Add more as needed
];

const CompromisedPasswords = () => (
  <div className="compromised-passwords-div">
    <h1>Compromised Passwords</h1>
    <p>Below are the services and usernames associated with compromised passwords.</p>
    <table className="compromised-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        {compromisedPasswords.map((item, idx) => (
          <tr key={idx}>
            <td>{item.service}</td>
            <td>{item.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CompromisedPasswords;
