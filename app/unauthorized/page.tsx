export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-semibold mb-2">Unauthorized</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
        <div className="mt-4">
          <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
}
