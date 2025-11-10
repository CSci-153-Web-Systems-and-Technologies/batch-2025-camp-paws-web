import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600">CAMP-PAWS</h1>
          <p className="mt-2 text-sm text-gray-600">
            Campus Animal Monitoring Platform
          </p>
        </div>
        
        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {children}
        </div>
        
        {/* Back to Home Link */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-green-600 hover:text-green-700 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
