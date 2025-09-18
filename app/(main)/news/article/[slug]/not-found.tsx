export default function NotFound() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Article Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/news"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to News
        </a>
      </div>
    </div>
  );
}