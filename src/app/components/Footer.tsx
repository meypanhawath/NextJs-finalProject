export default function Footer() {
  return (
    <footer className="bg-black/90 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00C6B1] to-blue-400 bg-clip-text text-transparent">
              MovieNight
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-[#00C6B1] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00C6B1] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00C6B1] transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00C6B1] transition-colors">
              Help Center
            </a>
          </div>
          
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Moviestan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}