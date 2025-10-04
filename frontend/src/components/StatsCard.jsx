import React from 'react'

const StatsCard = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const { overview } = stats

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Platform Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {overview?.totalBooks || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            📚 Total Books
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {overview?.totalReviews || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            ⭐ Total Reviews
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            {overview?.averageRating?.toFixed(1) || '0.0'}
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            🏆 Average Rating
          </div>
        </div>
      </div>
      
      {/* Genre Statistics */}
      {stats.genreStats && stats.genreStats.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            📈 Popular Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.genreStats.slice(0, 5).map((genre, index) => (
              <div
                key={genre._id}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {genre._id}
                </span>
                <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">
                  ({genre.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsCard
