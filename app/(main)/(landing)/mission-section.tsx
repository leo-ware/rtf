'use client'

import Vimeo from '@/components/Vimeo'
import Link from 'next/link'

const MissionSection = () => {
    return (
        <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 flex">
                    <div className="w-1/2 text-center">
                        <h4 className="text-2xl font-semibold text-gray-700 mb-6">Our Mission</h4>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
                            Return to Freedom is dedicated to preserving the freedom, diversity, and habitat of America&apos;s wild horses and burros through sanctuary, education, advocacy, and conservation, while enriching the human spirit through direct experience with the natural world.
                        </p>
                        <Link href="/about/our-mission" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                            Learn More
                        </Link>
                    </div>
                    <div className="w-1/2">
                        <Vimeo videoId="160682894" />
                    </div>
                </div>
            </section>
    )
}

export default MissionSection
