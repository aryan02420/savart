import { NextRequest } from "next/server";
import { searchCompanies } from "@/lib/scrappers/searchCompanies";
import { SearchStockResponse } from "@/lib/rpc";

export async function GET(request: NextRequest) {
	const searchQuery = request.nextUrl.searchParams.get('q');

	try {
		if (!searchQuery) {
			const companies: SearchStockResponse = [];
			return Response.json(companies);
		}

		const companies = await searchCompanies(searchQuery);
		return Response.json(companies);

	} catch (error: unknown) {
		return Response.json({ error: error }, { status: 500 })
	}
}