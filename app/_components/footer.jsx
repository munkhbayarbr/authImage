import { FaInstagram, FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='w-full py-4 bg-neutral-200 text-neutral-700 border-t border-neutral-300'>
      <div className='flex flex-col items-center'>
        <p className='mb-2 text-md'>Developed by Muba.</p>
        <div className='flex space-x-4'>
          <a
            href='https://www.instagram.com/munhbayarr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-neutral-700 hover:text-pink-500 transition-colors'
            aria-label='Instagram'
          >
            <FaInstagram size={20} />
          </a>
          <a
            href='https://www.linkedin.com/in/munkhbayar-b-657265207/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-neutral-700 hover:text-blue-700 transition-colors'
            aria-label='LinkedIn'
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href='https://github.com/munkhbayarbr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-neutral-700 hover:text-gray-900 transition-colors'
            aria-label='GitHub'
          >
            <FaGithub size={20} />
          </a>
          <a
            href='https://www.facebook.com/munkhbayar.byambadelger.1/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-neutral-700 hover:text-blue-600 transition-colors'
            aria-label='Facebook'
          >
            <FaFacebook size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
