export default function SiteFooter() {
  return (
    <footer className="bg-[#1a3a4a] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg font-semibold mb-1">Edward & Amaury Solicitors</p>
        <p className="text-sm text-gray-300 mb-2">SRA Regulated | SRA No: 800525 | Carlisle, Cumbria</p>
        <a href="tel:+441228272395" className="text-[#5eead4] font-semibold hover:text-white transition-colors">
          01228 272395
        </a>
        <p className="text-xs text-gray-400 mt-4">
          Edward & Amaury Solicitors is authorised and regulated by the Solicitors Regulation Authority (SRA No: 800525).
        </p>
        <p className="text-xs text-gray-500 mt-3">
          <a href="/privacy-policy" className="hover:text-white underline transition-colors">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}
