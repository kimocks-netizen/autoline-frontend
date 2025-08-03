import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/27676308447?text=Hello%20Autoline%20Panel%20Shop,%20My%20car%20got%20into%20accident%20i%20need%20to%20enquire%20about%20quotation.."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition duration-300 ease-in-out animate-bounce-delay"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={25} />
    </a>
  );
};

export default FloatingWhatsAppButton;
