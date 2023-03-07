/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-sequences */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-alert */

"use strict";
// Enable BigInt
/* global BigInt */
import * as math from "mathjs";

const randomNumGen = (min, max) => {
  const random = Math.random();
  return Math.floor(random * (max - min + 1)) + min;
};

const phi = (p, q) => math.lcm(p - 1, q - 1);

// Check if a number is prime
const isPrime = (num) => {
  if (num < 2) {
    return false;
  }
  // Check if number is divisible by any number between 2 and the square root of the number
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  // If it is not divisible by any number between 2 and the square root of the number, it is prime
  return true;
};

// Check if two numbers are coprime
const areCoprime = (num1, num2) => {
  // Check if any number between 2 and the smaller number is a factor of both numbers
  for (let i = 2; i <= Math.min(num1, num2); i++) {
    if (num1 % i === 0 && num2 % i === 0) {
      return false;
    }
  }
  // If no number between 2 and the smaller number is a factor of both numbers, they are coprime
  return true;
};

// Find the modular inverse of a number
const modInverse = (num, mod) => {
  for (let x = 1; x < mod; x++) {
    // If the product of the number and x is divisible by the mod, x is the modular inverse
    if ((num * x) % mod === 1) {
      return x;
    }
  }
  // If no number between 1 and the mod is the modular inverse, return 1
  return 1;
};

// Generate two prime numbers
const generateTwoPrimes = (min, max) => {
  let prime1, prime2;
  // Generate two random numbers and check if they are prime
  do {
    prime1 = randomNumGen(min, max);
  } while (!isPrime(prime1));

  do {
    prime2 = randomNumGen(min, max);
  } while (!isPrime(prime2) || prime2 === prime1);

  return [prime1, prime2];
};

// Generate RSA keys
export const generateRSAKeys = (min, max) => {
  let primes = generateTwoPrimes(min, max);
  let p = primes[0];
  let q = primes[1];
  // Calculate n and r where n = p * q and r = (p - 1) * (q - 1)
  let n = p * q;
  let r = (p - 1) * (q - 1);
  let e, d;

  // Generate a random number between 2 and r - 1 that is coprime with r
  do {
    e = randomNumGen(2, r - 1);
  } while (!areCoprime(e, r) || !isPrime(e));

  // Find the modular inverse of e
  do {
    d = modInverse(e, r);
    while (!isPrime(d)) {
      d += r;
    }
  } while (!isPrime(d));
  // Return the public key and private key
  return {
    publicKey: [e, n],
    privateKey: d,
  };
};

// Encrypt a message using RSA encryption
export const encryptRSA = (message, publicKey) => {
  const [e = 0, n = 0] = publicKey;
  let encryptedMessage = "";

  // Convert each character in the message to a number, encrypt it, and add it to the encrypted message
  for (let i = 0; i < message.length; i++) {
    // Get the character code of the character
    const charCode = message.charCodeAt(i);
    // Encrypt the character code using the public key and n from the public key
    const encryptedCharCode = modExp(BigInt(charCode), BigInt(e), BigInt(n));

    // Pad the encrypted character code with 0s so that it is 8 characters long so that it can be converted to hex
    encryptedMessage += encryptedCharCode.toString(16).padStart(8, "0");
  }
  // Return the encrypted message
  return encryptedMessage;
};

// Decrypt a message using RSA encryption
export const decryptRSA = (encryptedMessage, privateKey, n) => {
  // Convert a hex string to a BigInt
  const hexToBigInt = (hexString) => {
    return BigInt("0x" + hexString.padStart(8, "0"));
  };

  let decryptedMessage = "";

  // Convert each 8 character chunk of the encrypted message to a number, decrypt it, and add it to the decrypted message
  for (let i = 0; i < encryptedMessage.length; i += 8) {
    // Get the 8 character chunk of the encrypted message
    let hexChunk = encryptedMessage.substring(i, i + 8);

    // Convert the hex chunk to a BigInt
    const encryptedCharCode = hexToBigInt(hexChunk);

    // Decrypt the character code and convert it to a character to add to the decrypted message using the private key and n from the public key
    const decryptedCharCode = modExp(
      encryptedCharCode,
      BigInt(privateKey),
      BigInt(n)
    );

    decryptedMessage += String.fromCharCode(Number(decryptedCharCode));
  }

  return decryptedMessage;
};
const modExp = (base, exponent, modulus) => {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n == 1n) result = (result * base) % modulus;
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  return result;
};

export const crackRSA = (n, e) => {
  const p = findFactor(n);
  const q = n / p;
  const phiN = phi(p, q);

  let d = 1;
  while ((e * d) % phiN !== 1) {
    d++;
  }

  return d;
};

const findFactor = (n) => {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return i;
    }
  }
  return n;
};

//Generate RSA keys
const keyGen = generateRSAKeys(1, 10);

//Encrypt and decrypt a message
const encryptedMessage = encryptRSA("Hello World ", keyGen.publicKey);
const decryptedMessage = decryptRSA(
  encryptedMessage,
  keyGen.privateKey,
  keyGen.publicKey[1]
);
console.log(keyGen);
console.log(encryptedMessage);
console.log(decryptedMessage);
