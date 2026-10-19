import * as React from "react";

/**
 * EmPress icon mark — an em dash pressed into a ring.
 * Drawn in currentColor so it takes the color of its context (white in the
 * admin bar, ink on the login screen).
 */
export function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx="32" cy="32" r="28.5" stroke="currentColor" strokeWidth="5" />
			<circle cx="32" cy="32" r="21" fill="currentColor" />
			<rect x="19" y="29" width="26" height="6" rx="1" fill="var(--empress-logo-cut, #fff)" />
		</svg>
	);
}

/**
 * Full logo lockup — icon + "EmPress" wordmark.
 */
export function LogoLockup({ className, ...props }: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 300 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			role="img"
			aria-label="EmPress"
			{...props}
		>
			<circle cx="32" cy="32" r="28.5" stroke="currentColor" strokeWidth="5" />
			<circle cx="32" cy="32" r="21" fill="currentColor" />
			<rect x="19" y="29" width="26" height="6" rx="1" fill="var(--empress-logo-cut, #fff)" />
			<text
				x="76"
				y="45"
				fill="currentColor"
				fontFamily="Georgia, 'Times New Roman', serif"
				fontSize="42"
				letterSpacing="-0.5"
			>
				EmPress
			</text>
		</svg>
	);
}

interface BrandLogoProps {
	logoUrl?: string;
	siteName?: string;
	className?: string;
}

export function BrandLogo({ logoUrl, siteName, className }: BrandLogoProps) {
	if (logoUrl) {
		return (
			<img
				src={logoUrl}
				alt={siteName || ""}
				className={className}
				style={{ objectFit: "contain" }}
			/>
		);
	}
	return <LogoLockup className={className} />;
}

interface BrandIconProps {
	logoUrl?: string;
	siteName?: string;
	className?: string;
}

export function BrandIcon({ logoUrl, siteName, className }: BrandIconProps) {
	if (logoUrl) {
		return (
			<img
				src={logoUrl}
				alt={siteName || ""}
				className={className}
				style={{ objectFit: "contain" }}
			/>
		);
	}
	return <LogoIcon className={className} />;
}
