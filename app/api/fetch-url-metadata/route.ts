import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Validate URL
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return NextResponse.json({ error: 'Invalid URL protocol' }, { status: 400 });
        }

        // Fetch the webpage
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; URL-metadata-fetcher/1.0)',
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: response.status });
        }

        const html = await response.text();

        // Extract metadata using simple regex patterns
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descriptionMatch = html.match(/<meta[^>]*name=[\"']description[\"'][^>]*content=[\"']([^\"']+)[\"']/i) ||
                                html.match(/<meta[^>]*property=[\"']og:description[\"'][^>]*content=[\"']([^\"']+)[\"']/i);
        const siteNameMatch = html.match(/<meta[^>]*property=[\"']og:site_name[\"'][^>]*content=[\"']([^\"']+)[\"']/i);

        const metadata = {
            title: titleMatch ? titleMatch[1].trim() : '',
            description: descriptionMatch ? descriptionMatch[1].trim() : '',
            siteName: siteNameMatch ? siteNameMatch[1].trim() : urlObj.hostname,
        };

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Error fetching URL metadata:', error);
        return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
    }
}