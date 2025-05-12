import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <Link href="/" className="mb-4 md:mb-0">
          <Image src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>

        <div className="md:pl-64 mb-4 md:mb-0">
          {/* Добавлен отступ слева для смещения вправо */}
          <a
            href="https://github.com/OmRakerz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <FaGithub className="mr-2 text-lg" />
            Three V's
          </a>
        </div>

        <div>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            &copy; {currentYear} HomeHaven. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
