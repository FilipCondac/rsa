// RSAForm.js
import React, { useState } from "react";
import { generateRSAKeys, encryptRSA, decryptRSA } from "./rsa";

function RSAForm() {
  const [message, setMessage] = useState("");
  const [publicKey, setPublicKey] = useState([]);
  const [privateKey, setPrivateKey] = useState(0);
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");

  const handleEncrypt = (event) => {
    event.preventDefault();
    const keys = generateRSAKeys(100, 1000);
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setEncryptedMessage(encryptRSA(message, keys.publicKey));
  };

  const handleDecrypt = (event) => {
    event.preventDefault();
    setDecryptedMessage(decryptRSA(encryptedMessage, privateKey, publicKey[1]));
  };

  return (
    <div>
      <form onSubmit={handleEncrypt}>
        <label>
          Alice's Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Encrypt</button>
      </form>
      {publicKey.length > 0 && (
        <div>
          <p>Bobs Public key: [{publicKey.join(", ")}]</p>
          <p>Charlie sees (Encrypted message: {encryptedMessage})</p>
          <form onSubmit={handleDecrypt}>
            <label>
              Encrypted message:
              <input
                type="text"
                value={encryptedMessage}
                onChange={(e) => setEncryptedMessage(e.target.value)}
              />
            </label>
            <button type="submit">Decrypt</button>
          </form>
          {decryptedMessage && (
            <div>
              <p>Only bob knows (Private Key: [{privateKey}])</p>
              <p>Bobs displayed Decrypted message: {decryptedMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>RSA Encryption/Decryption</h1>
      <RSAForm />
    </div>
  );
}

export default App;
