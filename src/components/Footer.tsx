export default function Footer() {
    return (
      <footer className=" py-10 px-6 text-center">
        <h3 className="text-2xl font-semibold mb-4 ">Join the NextServe Community</h3>
        <p className="mb-6 text-sm md:text-base max-w-xl mx-auto ">
          Discover your next tennis partner, improve your game with top coaches, and explore the best courts around you.
        </p>
        <p className="text-xs ">
          © {new Date().getFullYear()} NextServe.
        </p>
      </footer>
    );
  }
  