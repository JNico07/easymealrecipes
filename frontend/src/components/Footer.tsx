const Footer = () => {
  return (
    <footer className="w-full text-center text-sm text-gray-600 py-2 bg-white border-t">
      <p>
        🍽️ Powered by{" "}
        <a
          href="https://www.themealdb.com/api.php"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          TheMealDB API
        </a>
      </p>
      <p className="mt-1">
        <a
          href="https://github.com/JNico07/easymealrecipes.git"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 underline hover:text-gray-800 mx-2"
        >
          GitHub Repo
        </a>
        |
        <a
          href="https://linkedin.com/in/jaynicoolano"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 underline hover:text-gray-800 mx-2"
        >
          LinkedIn
        </a>
      </p>
      <p className="mt-1 text-gray-400">
        EasyMealRecipes © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
