import { Popover } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react/macro";
import { SignOut, Shield, Gear, House, Plus } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { apiFetch } from "../lib/api/client";
import { useCurrentUser } from "../lib/api/current-user";
import { LogoIcon } from "./Logo";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export type { CurrentUser } from "../lib/api/current-user";

async function handleLogout() {
	// Clear the public-site toolbar-bootstrap flag (see Shell.tsx).
	try {
		localStorage.removeItem("emdash-editor");
		localStorage.removeItem("emdash-toolbar-labels");
	} catch {
		// ignore — flag is best-effort
	}
	const res = await apiFetch("/_emdash/api/auth/logout?redirect=/_emdash/admin/login", {
		method: "POST",
		credentials: "same-origin",
	});
	if (res.redirected) {
		window.location.href = res.url;
	} else {
		window.location.href = "/_emdash/admin/login";
	}
}

export interface HeaderProps {
	siteName?: string;
	collections?: Record<string, { label: string; hidden?: boolean }>;
}

/**
 * WordPress-style admin bar: a slim dark strip across the top of the admin
 * with the site link, a "+ New" menu and the "Howdy" account menu.
 * Uses useSidebar() hook from kumo Sidebar.Provider context.
 */
export function Header({ siteName, collections = {} }: HeaderProps) {
	const { t } = useLingui();
	const [userMenuOpen, setUserMenuOpen] = React.useState(false);
	const [newMenuOpen, setNewMenuOpen] = React.useState(false);

	const { data: user } = useCurrentUser();

	const displayName = user?.name || user?.email || t`User`;
	const initialsSource = user?.name || user?.email || "U";
	const initials = (initialsSource[0] ?? "U").toUpperCase();
	const newEntries = Object.entries(collections).filter(([, config]) => !config.hidden);

	return (
		// h-8 is mirrored by ADMIN_HEADER_HEIGHT_PX in ContentEditor.tsx
		// (the settings sheet offsets its body by it) — change both together.
		<header className="empress-adminbar" data-empress-adminbar="">
			{/* The desktop trigger lives in the sidebar footer; mobile keeps it here so the closed sheet can reopen. */}
			<Sidebar.Trigger className="empress-adminbar-item cursor-pointer md:hidden rtl:rotate-180" />

			<Link
				to="/"
				className="empress-adminbar-item empress-adminbar-logo"
				aria-label={t`Dashboard`}
			>
				<LogoIcon className="size-5" aria-hidden="true" />
			</Link>

			<a href="/" className="empress-adminbar-item" target="_blank" rel="noreferrer">
				<House className="size-4" weight="fill" aria-hidden="true" />
				<span className="hidden sm:inline max-w-[200px] truncate">{siteName || t`View Site`}</span>
			</a>

			{newEntries.length > 0 && (
				<Popover open={newMenuOpen} onOpenChange={setNewMenuOpen}>
					<Popover.Trigger asChild>
						<button type="button" className="empress-adminbar-item cursor-pointer">
							<Plus className="size-4" weight="bold" aria-hidden="true" />
							<span className="hidden sm:inline">{t`New`}</span>
						</button>
					</Popover.Trigger>
					<Popover.Content className="empress-adminbar-menu w-44" align="start">
						{newEntries.map(([name, config]) => (
							<Link
								key={name}
								to="/content/$collection/new"
								params={{ collection: name }}
								search={{ locale: undefined }}
								onClick={() => setNewMenuOpen(false)}
							>
								{config.label}
							</Link>
						))}
						<Link to="/media" search={{ folder: undefined }} onClick={() => setNewMenuOpen(false)}>
							{t`Media`}
						</Link>
					</Popover.Content>
				</Popover>
			)}

			<div className="ms-auto flex items-center">
				<ThemeToggle />

				<Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
					<Popover.Trigger asChild>
						<button type="button" className="empress-adminbar-item cursor-pointer">
							<span className="hidden sm:inline max-w-[160px] truncate">
								{t`Howdy, ${displayName}`}
							</span>
							{user?.avatarUrl ? (
								<img src={user.avatarUrl} alt="" className="size-[18px] object-cover" />
							) : (
								<span className="empress-adminbar-avatar">{initials}</span>
							)}
						</button>
					</Popover.Trigger>

					<Popover.Content className="empress-adminbar-menu w-56" align="end">
						<div className="empress-adminbar-menu-user">
							<div className="font-semibold truncate">{user?.name || t`User`}</div>
							<div className="truncate opacity-80">{user?.email}</div>
						</div>
						<Link to="/settings/security" onClick={() => setUserMenuOpen(false)}>
							<Shield className="h-4 w-4" />
							{t`Security Settings`}
						</Link>
						<Link to="/settings" onClick={() => setUserMenuOpen(false)}>
							<Gear className="h-4 w-4" />
							{t`Settings`}
						</Link>
						<button type="button" onClick={handleLogout} className="cursor-pointer">
							<SignOut className="h-4 w-4" />
							{t`Log out`}
						</button>
					</Popover.Content>
				</Popover>
			</div>
		</header>
	);
}
