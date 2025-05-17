import { z } from "zod";
import { SearchStockResponse } from "../rpc";
import { kv } from "@vercel/kv";
import { SECONDS_IN_SIX_HOURS } from "../constants";

const ScreenerResponseSchema = z.array(
	z.union([
		z.object({
			id: z.number(),
			name: z.string(),
			/** url is of the format `/company/519574/` or `/company/HINDUNILVR/consolidated/` */
			url: z.string(),
		}),
		z.object({
			id: z.null(),
			name: z.string(),
			url: z.string(),
		}),
	])
);

export async function searchCompanies(searchQuery: string) {
	const kvKey = `search-companies-${searchQuery}`;
	const cachedData = await kv.get<string>(kvKey);

	if (cachedData) {
		return cachedData;
	}

	const searchResponse = await fetch(`https://www.screener.in/api/company/search/?q=${searchQuery}&v=3&fts=1`, {
		credentials: "include",
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:138.0) Gecko/20100101 Firefox/138.0",
			Accept: "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"X-Requested-With": "XMLHttpRequest",
			"Sec-GPC": "1",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-origin",
			Priority: "u=0"
		},
		referrer: "https://www.screener.in/",
		method: "GET",
		mode: "cors"
	});
	
	const searchJson = await searchResponse.json();
	const data = await ScreenerResponseSchema.parseAsync(searchJson);
	
	const companies: SearchStockResponse = [];
	for (const datum of data) {
		if (!datum.id) continue;
		const id = datum.url.split('/').at(2);
		if (!id) continue;
		companies.push({
			id,
			name: datum.name,
		});
	}

	kv.set(kvKey, companies, { ex: SECONDS_IN_SIX_HOURS });
	return companies;
}