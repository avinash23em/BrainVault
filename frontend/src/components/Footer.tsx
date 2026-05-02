export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto rounded-t-2xl">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-purple-600 font-bold text-lg"></span>
            <span className="ml-2 text-gray-600">Your digital memory companion</span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="text-sm text-gray-500">
              , for better organization.
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
