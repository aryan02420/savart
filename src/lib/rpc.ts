export type SearchStockResponse = {
	id: string;
	name: string;
}[];

export async function searchStocks(query: string): Promise<SearchStockResponse> {
	const res = await fetch(`/api/search-stocks/?q=${query}`, {
		method: "GET"
	});
	const data = await res.json();
	if (!res.ok) {
		console.log("RPC Error:", data);
		throw new Error(data.error);
	}
	return data
}

export function getSearchStocksQueryKey(query: string) {
	return ["search-stocks", query];
}
