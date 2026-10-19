export function formatAdminVersion(
	version?: string,
	commit?: string,
	footerLabel: string | false = "EmPress",
): string {
	const versionText = `v${version || "0.0.0"}${commit ? ` (${commit})` : ""}`;
	return footerLabel === false ? versionText : `${footerLabel || "EmPress"} ${versionText}`;
}
