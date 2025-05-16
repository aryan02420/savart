import { getStockDetails } from '@/lib/scrappers/getStockDetails';
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

interface StockDetailsProps {
	params: Promise<{ id: string }>
}

export default async function StockDetailsPage(props: StockDetailsProps) {
	const { params } = props;
	const { id } = await params;

	const data = await getStockDetails(id);

	return (
		<div className="grid auto-rows-min gap-4 md:grid-cols-2">
			<section className="p-6 bg-muted rounded-xl">
				<h1 className="text-2xl font-bold mb-2">{data.name}</h1>
				<p>{data.description}</p>
			</section>
			<section className="p-6 bg-muted rounded-xl">
				<h2 className="text-lg font-medium uppercase mb-4 sr-only">Stats</h2>
				{data.summary.length > 0 ? (
					<dl className="grid grid-rows-5 grid-flow-col gap-4">
						{data.summary.map((item) => (
							<div key={item.name}>
								<dt className="text-muted-foreground">{item.name}</dt>
								<dd className="font-medium text-lg">{item.value}</dd>
							</div>
						))}
					</dl>
				) : (
					"No summary available for the stock"
				)}
			</section>
			<section className="p-6 bg-green-50 rounded-xl">
				<h2 className="text-lg font-medium uppercase mb-4 "><ThumbsUpIcon className="inline size-[1em] mr-1"/> Pros</h2>
				{data.pros.length > 0 ? (
					<ul className="list-disc list-inside">
						{data.pros.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				) : (
					"--"
				)}
			</section>
			<section className="p-6 bg-red-50 rounded-xl">
				<h2 className="text-lg font-medium uppercase mb-4 "><ThumbsDownIcon className="inline size-[1em] mr-1"/> Cons</h2>
				{data.cons.length > 0 ? (
					<ul className="list-disc list-inside">
						{data.cons.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				) : (
					"--"
				)}
			</section>
		</div>
	);
}
