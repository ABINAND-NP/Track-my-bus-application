export default function AdminFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/90 py-6 sm:py-7 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* Copyright notice */}
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} TrackMyBus.</span>
            <span>All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 sm:gap-6 font-medium">
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#security"
              onClick={(e) => e.preventDefault()}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Security
            </a>
            <a
              href="#support"
              onClick={(e) => e.preventDefault()}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

