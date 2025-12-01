'use client';
import { usePathname } from 'next/navigation';

const PAGE_HEADERS: Record<string, { title: string; description: string }> = {
  '/user-dashboard': {
    title: 'User Dashboard',
    description: 'See your reporting activity and the campus-wide summary of stray sightings.'
  }
  // You can add more page headers here over time
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const headerInfo = PAGE_HEADERS[pathname] || { 
    title: 'CAMP-PAWS Dashboard', 
    description: '' 
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-red-500">
        {/* Sidebar content */}
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-green-600">{headerInfo.title}</h1>
          {headerInfo.description && (
            <p className="text-gray-600 mt-1">{headerInfo.description}</p>
          )}
        </header>
        
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
