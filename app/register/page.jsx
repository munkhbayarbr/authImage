'use client';
import { auth } from '@/utils/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import CryptoJS from 'crypto-js';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const deriveKey = (password) => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const derivedKey = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });
    return {
      key: derivedKey.toString(CryptoJS.enc.Hex),
      salt: salt.toString(),
    };
  };

  const embedPasswordIntoImage = (file, encryptedPasswordWithSalt) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject('No file provided');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const binaryPassword = encryptedPasswordWithSalt
          .split('')
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join('');

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let dataIndex = 0;

        for (let i = 0; i < binaryPassword.length; i++) {
          data.data[dataIndex] =
            (data.data[dataIndex] & 0xfe) | binaryPassword[i];
          dataIndex += 4;
        }

        ctx.putImageData(data, 0, 0);
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };

      img.onerror = () => reject('Failed to load image');
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please upload an image');

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);

      const { key, salt } = deriveKey('secretKey');

      const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
      console.log('Encrypted password:', encryptedPassword);
      const encryptedPasswordWithSalt = `${salt}:${encryptedPassword}`;
      console.log('Encrypted password with salt:', encryptedPasswordWithSalt);
      const newImage = await embedPasswordIntoImage(
        image,
        encryptedPasswordWithSalt
      );

      const url = URL.createObjectURL(newImage);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'image_with_password.png';
      link.click();

      alert('Registration successful! Download the image with password');
    } catch (error) {
      console.error(error);
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6'>Register</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='email'
            placeholder='Email'
            className='w-full p-3 border rounded'
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            className='w-full p-3 border rounded'
            onChange={(e) => setPassword(e.target.value)}
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
                alert('Please select a valid image file.');
              }
            }}
          />
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className='flex items-center justify-center'>
          <Link href='/login'>
            <button className='w-24 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition mt-2'>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
