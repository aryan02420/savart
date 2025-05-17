/**
 * @note we do not verify the check digit for now.
 */
export function isISIN(isin: string): boolean {
	return /^[A-Z0-9]{12}$/i.test(isin);
}
