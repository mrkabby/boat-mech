import {  HardHat } from 'lucide-react';

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <HardHat className="h-8 w-8 text-green-600" />
      <span className="text-2xl font-bold tracking-tight">
        Boat Mech
      </span>
    </Link>
  );
}
