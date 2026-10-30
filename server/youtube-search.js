const fetch = require('node-fetch');

/**
 * Lightweight YouTube search that scrapes the public results page.
 *
 * The project previously relied on the YouTube Data API v3 `search.list`
 * endpoint (via the `youtube-search` package). That endpoint costs 100 quota
 * units per call against a default budget of 10,000 units/day, so the key was
 * permanently exhausted and the Videos page never rendered any results. This
 * implementation needs no API key and no quota: it requests the same results
 * page a browser would and parses the `ytInitialData` blob embedded in the HTML.
 */

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map();

// `sp=EgIQAQ%3D%3D` restricts the results to videos only.
const RESULTS_URL = 'https://www.youtube.com/results?search_query=%TERM%&sp=EgIQAQ%253D%253D';

function extractInitialData(html) {
  const patterns = [
    /var ytInitialData = (\{.+?\});<\/script>/s,
    /window\["ytInitialData"\]\s*=\s*(\{.+?\});\s*<\/script>/s,
    /ytInitialData"\]\s*=\s*(\{.+?\});/s
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {
        /* try the next pattern */
      }
    }
  }
  return null;
}

function runsToText(runs) {
  if (!Array.isArray(runs)) return '';
  return runs.map(run => run.text).join('');
}

function parseVideos(data) {
  const sections = data &&
    data.contents &&
    data.contents.twoColumnSearchResultsRenderer &&
    data.contents.twoColumnSearchResultsRenderer.primaryContents &&
    data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer &&
    data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;

  if (!Array.isArray(sections)) return [];

  const videos = [];
  for (const section of sections) {
    const items = section &&
      section.itemSectionRenderer &&
      section.itemSectionRenderer.contents;
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      const video = item.videoRenderer;
      if (!video || !video.videoId) continue;

      const id = video.videoId;
      const description = video.detailedMetadataSnippets &&
        video.detailedMetadataSnippets[0] &&
        video.detailedMetadataSnippets[0].snippetText
        ? runsToText(video.detailedMetadataSnippets[0].snippetText.runs)
        : runsToText(video.descriptionSnippet && video.descriptionSnippet.runs);

      videos.push({
        id,
        link: `https://www.youtube.com/watch?v=${id}`,
        kind: 'youtube#video',
        title: video.title ? runsToText(video.title.runs) : '',
        description,
        channelTitle: video.ownerText ? runsToText(video.ownerText.runs) : '',
        publishedAt: video.publishedTimeText ? video.publishedTimeText.simpleText : '',
        thumbnails: {
          default: { url: `https://i.ytimg.com/vi/${id}/default.jpg`, width: 120, height: 90 },
          medium: { url: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`, width: 320, height: 180 },
          high: { url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, width: 480, height: 360 }
        }
      });
    }
  }
  return videos;
}

async function search(term, { maxResults = 10 } = {}) {
  const key = String(term).trim().toLowerCase();
  if (!key) return [];

  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.videos.slice(0, maxResults);
  }

  const url = RESULTS_URL.replace('%TERM%', encodeURIComponent(term));
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  if (!response.ok) {
    throw new Error(`YouTube responded with status ${response.status}`);
  }

  const html = await response.text();
  const data = extractInitialData(html);
  if (!data) {
    throw new Error('Could not parse YouTube search results.');
  }

  const videos = parseVideos(data);
  cache.set(key, { time: Date.now(), videos });
  return videos.slice(0, maxResults);
}

module.exports = search;
