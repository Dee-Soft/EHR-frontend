export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} Electronic Health Record System. All rights reserved.
      </div>
    </footer>
  );
}
