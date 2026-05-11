export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-5">
        <p className="text-xs text-text-muted text-center">
          © {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}