import React, { useState } from "react";
import { generateRSAKeys, encryptRSA, decryptRSA, crackRSA } from "./rsa";

function RSAForm() {
  const [message, setMessage] = useState("");
  const [publicKey, setPublicKey] = useState([]);
  const [privateKey, setPrivateKey] = useState(0);
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [crackedPrivateKey, setCrackedPrivateKey] = useState(0);
  const [charlieDecryptedMessage, setCharlieDecryptedMessage] = useState("");

  const handleEncrypt = (event) => {
    event.preventDefault();
    const keys = generateRSAKeys(10, 20);
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setEncryptedMessage(encryptRSA(message, keys.publicKey));
  };

  const handleDecrypt = (event) => {
    event.preventDefault();
    setDecryptedMessage(decryptRSA(encryptedMessage, privateKey, publicKey[1]));
  };

  const handleCrack = async (event) => {
    event.preventDefault();
    const [e, n] = publicKey;
    const privateKey = crackRSA(n, e);
    setCrackedPrivateKey(privateKey);
  };

  const handleCharlieDecrypt = (event) => {
    event.preventDefault();
    setCharlieDecryptedMessage(
      decryptRSA(encryptedMessage, crackedPrivateKey, publicKey[1])
    );
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
            <button type="submit">Decrypt with Bob's Private Key</button>
          </form>
          {decryptedMessage && (
            <div>
              <p>Only Bob knows (Private Key: [{privateKey}])</p>
              <p>Bobs displayed Decrypted message: {decryptedMessage}</p>
            </div>
          )}
          <form onSubmit={handleCrack}>
            <button type="submit">Brute force Private Key</button>
          </form>
          {crackedPrivateKey > 0 && (
            <div>
              <p>
                Charlie sometimes finds the actual key or possibly a key that
                isn't the actual key but is close enough to decrypt the message
                or actually decrypts it!
              </p>
              <p>Private Key: [{crackedPrivateKey}]</p>
              <form onSubmit={handleCharlieDecrypt}>
                <button type="submit">
                  Decrypt with Charlie's Private Key
                </button>
              </form>
              {charlieDecryptedMessage && (
                <div>
                  <p>Charlie's decrypted message: {charlieDecryptedMessage}</p>
                </div>
              )}
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
