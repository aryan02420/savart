import { Browser, BrowserErrorCaptureEnum } from 'happy-dom';
import { kv } from '@vercel/kv';
import { SECONDS_IN_SIX_HOURS } from '@/lib/constants';

export interface StockDetailsData {
	id: string;
	name: string;
	description: string;
	summary: {
		name: string;
		value: string;
	}[];
	pros: string[];
	cons: string[];
}

const _staticData: StockDetailsData = {
	id: 'COASTCORP',
	name: 'Coastal Corporation Ltd',
	description: 'Incorporated in 1981, Coastal Corporation Ltd is engaged in processing and export of sea food',
	summary: [
		{ name: 'Market Cap', value: '₹ 443 Cr.' },
		{ name: 'Current Price', value: '₹ 136' },
		{ name: 'High / Low', value: '₹ 233 / 108' },
		{ name: 'Stock P/E', value: '20.4' },
		{ name: 'Book Value', value: '₹ 63.5' },
		{ name: 'Dividend Yield', value: '1.84 %' },
		{ name: 'ROCE', value: '12.4 %' },
		{ name: 'ROE', value: '8.88 %' },
		{ name: 'Face Value', value: '₹ 1.00' }
	],
	pros: [
		'Company has been maintaining a healthy dividend payout of 29.8%',
		'Company has been maintaining a healthy dividend payout of 29.8%',
	],
	cons: [
		'Company has a low return on equity of 8.62% over last 3 years.',
		'Company has a low return on equity of 8.62% over last 3 years.',
		'Company has a low return on equity of 8.62% over last 3 years.',
	]
};

export async function getStockDetails(id: string) {
	const kvKey = `stock-details-${id}`
	const cachedData = await kv.get<StockDetailsData>(kvKey);

	if (cachedData) {
		console.log(`Stock data for ${id} is available in cache.`, cachedData);
		return cachedData
	}

	const browser = new Browser({ settings: { errorCapture: BrowserErrorCaptureEnum.processLevel } });
	const page = browser.newPage();
	const pageResponse = await page.goto(`https://www.screener.in/company/${id}/`);

	const data: StockDetailsData = {
		id,
		name: "",
		description: "",
		summary: [],
		pros: [],
		cons: [],
	}

	if (!pageResponse) {
		throw new Error("We have encountered and error and our team has been notified.")
	}

	if (!pageResponse?.ok) {
		throw new Error(`Stock ${id} not found.`)
	}

	const nameEl = page.mainFrame.document.querySelector('#top h1');
	const descEl = page.mainFrame.document.querySelector('.company-profile .about');
	const summaryEl = page.mainFrame.document.querySelector('#top-ratios');
	const prosEl = page.mainFrame.document.querySelector('#analysis .pros > ul');
	const consEl = page.mainFrame.document.querySelector('#analysis .cons > ul');

	if (!nameEl || !descEl || !summaryEl || !prosEl || !consEl) {
		throw new Error("We have encountered and error and our team has been notified.")
	}

	data.name = nameEl.textContent.trim();
	data.description = descEl.textContent.replaceAll(/\s+/g, " ").replaceAll(/\[\d+\]/g, "").trim()

	summaryEl.querySelectorAll('li').forEach(node => {
		const name = node.querySelector('.name').innerText.replaceAll(/\s+/g, " ").trim();
		const value = node.querySelector('.value').innerText.replaceAll(/\s+/g, " ").trim();
		data.summary.push({ name, value });
	});

	prosEl.querySelectorAll('li').forEach(node => {
		data.pros.push(node.innerText.replaceAll(/\s+/g, " ").trim());
	});

	consEl.querySelectorAll('li').forEach(node => {
		data.cons.push(node.innerText.replaceAll(/\s+/g, " ").trim());
	});

	console.log(`Scraped stock data for ${id}.`, data);
	kv.set(kvKey, data, { ex: SECONDS_IN_SIX_HOURS });
	return data;
}
