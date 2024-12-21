'use client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase.js';
import CryptoJS from 'crypto-js';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const extractPasswordFromImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let binaryPassword = '';

          for (let i = 0; i < data.data.length; i += 4) {
            binaryPassword += (data.data[i] & 1).toString();
            if (
              binaryPassword.length % 8 === 0 &&
              binaryPassword.slice(-8) === '00000000'
            )
              break;
          }

          const password = binaryPassword
            .match(/.{1,8}/g)
            .map((byte) => String.fromCharCode(parseInt(byte, 2)))
            .join('');

          resolve(password.replace(/\0/g, ''));
        } catch (error) {
          reject('Failed to extract password from the image.');
        }
      };

      img.onerror = () => reject('Error loading the image file.');
      img.src = URL.createObjectURL(file);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!image)
      return alert('Please upload the image with the hidden password');

    try {
      const extractedData = await extractPasswordFromImage(image);

      const [salt, encryptedPassword] = extractedData.split(':');
      if (!salt || !encryptedPassword) {
        throw new Error('Wrong password format');
      }

      const key = CryptoJS.PBKDF2('secretKey', CryptoJS.enc.Hex.parse(salt), {
        keySize: 256 / 32,
        iterations: 1000,
      });

      const decryptedPassword = CryptoJS.AES.decrypt(
        encryptedPassword,
        key.toString()
      ).toString(CryptoJS.enc.Utf8);

      if (!decryptedPassword)
        throw new Error('Decryption failed. Invalid key or data.');

      await signInWithEmailAndPassword(auth, email, decryptedPassword);

      setUserData({ email, password: decryptedPassword });
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6'>Login</h1>

        {errorMessage && (
          <p className='mt-4 text-center text-red-500'>{errorMessage}</p>
        )}

        {userData.email ? (
          <div className='mt-6'>
            <h2 className='text-lg font-semibold'>Logged in as:</h2>
            <p>Email: {userData.email}</p>
            <p>Password: {userData.password}</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className='space-y-4'>
            <input
              type='email'
              placeholder='Email'
              className='w-full p-3 border rounded'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='file'
              accept='image/*'
              className='w-full p-3'
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  setImage(selectedFile);
                } else {
                  alert('Please upload a valid image file.');
                }
              }}
            />
            <button
              type='submit'
              className='w-full bg-green-500 text-white p-3 rounded hover:bg-green-600'
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
