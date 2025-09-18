"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function NewsPage() {
  const articles = useQuery(api.articles.listArticles, {
    limit: 10,
    publishedOnly: true
  })

  if (articles === undefined) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">News</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">News</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>

            {articles.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-600">Check back soon for the latest news and updates.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article) => (
                  <article key={article._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    {article.imageUrl ? (
                      <div className="relative h-48 rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      <Link href={`/news/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {article.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(article.publishedAt), "MMM dd, yyyy")}
                          </div>
                        )}
                        {article.author && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author.name}
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/news/article/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Take Action</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">BLM Schedule Emphasizes Removals</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    The BLM plans to remove 10,444 wild horses and burros while treating only 209 with fertility control.
                  </p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                    Take Action
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Support Wyoming Horses</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    We need your support in our fight for Wyoming&apos;s wild horses!
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Blog Posts</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Regenerative Grazing Results</h4>
                  <p className="text-sm text-gray-600">Learn about our innovative land management practices.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Wildlife Summit</h4>
                  <p className="text-sm text-gray-600">Focus on interactions between wild horses and other wildlife.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Hayflation Impact</h4>
                  <p className="text-sm text-gray-600">Support our horses during challenging times.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
