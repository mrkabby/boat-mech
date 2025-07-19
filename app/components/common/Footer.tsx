export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Boat Mech. All rights reserved.</p>
        <p className="mt-1">Your trusted partner for quality tools and hardware equipment.</p>
      </div>
    </footer>
  );
}
