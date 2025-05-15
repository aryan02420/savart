"use client";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete } from "./Autocomplete";
import { getSearchStocksQueryKey, searchStocks } from "@/app/api/search-stocks/rpc";
import { useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";

const recommendedStockList = [
	{
	  "id": "COASTCORP",
	  "name": "Coastal Corp"
	},
	{
	  "id": "ITDCEM",
	  "name": "ITD Cem"
	},
	{
	  "id": "KRISHCA",
	  "name": "Krishca Strapp."
	},
	{
	  "id": "MODISONLTD",
	  "name": "Modison"
	},
	{
	  "id": "PERMAGNET",
	  "name": "Permanent Magnet"
	},
	{
	  "id": "WANBURY",
	  "name": "Wanbury"
	}
];


type Props = {
  onStockSelected: (id: string) => void;
};

export function StockAutocomplete(props: Props) {
	const { onStockSelected } = props;
	
	const [searchText, setSearchText] = useState("");
	const [query, debouncer] = useDebouncedValue(searchText, {
		wait: 100,
	})
	const isStale = debouncer.getIsPending()

	const { data, isFetching, isError } = useQuery({
		queryKey: getSearchStocksQueryKey(query),
		queryFn: () => searchStocks(query),
		enabled: Boolean(query),
	});

	const items = searchText && data ? data : recommendedStockList;

	return (
		<Autocomplete
			items={items}
			emptyMessage="No Stock found."
			placeholder="Search Stocks..."
			onSelect={onStockSelected}
			searchText={searchText}
			onSearchTextChange={setSearchText}
			isLoading={isFetching || isStale}
		/>
	);
}
