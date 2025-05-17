import { JSDOM } from 'jsdom';
import { kv } from '@vercel/kv';
import { SECONDS_IN_SIX_HOURS } from '@/lib/constants';

export async function getCompanyNameFromISIN(isin: string): Promise<string> {
	const kvKey = `isin-lookup-${isin}`;
	const cachedData = await kv.get<string>(kvKey);

	if (cachedData) {
		console.log(`Company name for ISIN ${isin} is available in cache.`, cachedData);
		return cachedData;
	}

	const fetchResponse = await fetch(`https://nsdl.co.in/master_search_detail_res.php?isin=${isin}`, {
		headers: {
			accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "en-GB,en;q=0.9",
			"cache-control": "max-age=0",
			"sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Linux\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
		},
		referrerPolicy: "strict-origin-when-cross-origin",
		body: null,
		method: "GET"
	});

	if (!fetchResponse.ok) {
		throw new Error("We have encountered and error and our team has been notified.");
	}

	const htmlString = await fetchResponse.text();
	const doc = new JSDOM(htmlString).window.document;

	const tableEl = doc.querySelector('#printTable');

	if (!tableEl) {
		throw new Error("Invalid ISIN");
	}

	const nameEl = tableEl.querySelector('tbody > tr:nth-child(3) > td:nth-child(2)');

	if (!nameEl || !nameEl.textContent) {
		throw new Error("We have encountered and error and our team has been notified.");
	}

	const companyName = nameEl.textContent.trim()

	console.log(`Scraped company name for ISIN ${isin}.`, companyName);
	kv.set(kvKey, companyName, { ex: SECONDS_IN_SIX_HOURS });
	return companyName;
}
