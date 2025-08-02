import { Wrench } from 'lucide-react';

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors">
      <Wrench className="h-8 w-8 text-blue-600" />
      <span className="text-2xl font-bold tracking-tight">
        Boat Mech
      </span>
    </Link>
  );
}
