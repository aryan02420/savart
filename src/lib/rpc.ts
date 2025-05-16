export type SearchStockResponse = {
	id: string;
	name: string;
}[];

export async function searchStocks(query: string): Promise<SearchStockResponse> {
	const res = await fetch(`/api/search-stocks/?q=${query}`, {
		method: "GET"
	});
	if (!res.ok) {
		throw new Error("Error fetching stocks");
	}
	return res.json();
}

export function getSearchStocksQueryKey(query: string) {
	return ["search-stocks", query];
}
