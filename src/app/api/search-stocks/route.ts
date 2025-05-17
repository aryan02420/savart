import { NextRequest } from "next/server";
import { searchCompanies } from "@/lib/scrappers/searchCompanies";
import { SearchStockResponse } from "@/lib/rpc";
import { getCompanyNameFromISIN } from "@/lib/scrappers/getCompanyNameFromISIN";
import { isISIN } from "@/lib/bizutils/isISIN";

export async function GET(request: NextRequest) {
	const searchQuery = request.nextUrl.searchParams.get('q');

	try {
		if (!searchQuery) {
			const companies: SearchStockResponse = [];
			return Response.json(companies);
		}

		if (isISIN(searchQuery)) {
			const companyName = await getCompanyNameFromISIN(searchQuery);
			const companies = await searchCompanies(companyName);
			return Response.json(companies);
		}

		const companies = await searchCompanies(searchQuery);
		return Response.json(companies);

	} catch (error: unknown) {
		return Response.json({ error: error }, { status: 500 })
	}
}