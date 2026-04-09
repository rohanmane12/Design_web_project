type TrafficInput = {
  currentUrl?: string;
  referrer?: string;
  utmSource?: string;
};

const SOCIAL_HOSTS = ['instagram.com', 'facebook.com', 'fb.com', 'linkedin.com', 'youtube.com', 'twitter.com', 'x.com'];
const SEARCH_HOSTS = ['google.', 'bing.com', 'yahoo.com', 'duckduckgo.com'];

function parseUrl(value?: string) {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function inferTrafficSource({ currentUrl, referrer, utmSource }: TrafficInput) {
  const normalizedUtmSource = utmSource?.trim().toLowerCase();

  if (normalizedUtmSource) {
    return normalizedUtmSource;
  }

  const current = parseUrl(currentUrl);
  const referrerUrl = parseUrl(referrer);
  const sourceParam = current?.searchParams.get('utm_source')?.trim().toLowerCase();

  if (sourceParam) {
    return sourceParam;
  }

  const referrerHost = referrerUrl?.hostname.toLowerCase();

  if (!referrerHost) {
    return 'direct';
  }

  if (SEARCH_HOSTS.some((host) => referrerHost.includes(host))) {
    return 'search';
  }

  if (SOCIAL_HOSTS.some((host) => referrerHost.includes(host))) {
    if (referrerHost.includes('instagram')) return 'instagram';
    if (referrerHost.includes('facebook') || referrerHost.includes('fb.com')) return 'facebook';
    if (referrerHost.includes('linkedin')) return 'linkedin';
    if (referrerHost.includes('youtube')) return 'youtube';
    if (referrerHost.includes('twitter') || referrerHost.includes('x.com')) return 'x';
    return 'social';
  }

  if (referrerHost.includes('whatsapp')) {
    return 'whatsapp';
  }

  return referrerHost.replace(/^www\./, '');
}

export function getUtmFields(currentUrl?: string) {
  const current = parseUrl(currentUrl);

  return {
    utmSource: current?.searchParams.get('utm_source') || undefined,
    utmMedium: current?.searchParams.get('utm_medium') || undefined,
    utmCampaign: current?.searchParams.get('utm_campaign') || undefined,
  };
}
