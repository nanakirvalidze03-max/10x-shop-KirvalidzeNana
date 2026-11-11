export function Footer() {
  return (
    <footer className="border-t-2 border-line bg-surface py-6 text-center text-sm font-medium text-ink-muted">
      © {new Date().getFullYear()} 10X Shop · Made with <span aria-label="love">♥</span> and way too much state · No real payments.
    </footer>
  );
}
