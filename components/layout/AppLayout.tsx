import type React from "react"
import Header from "./Header"
import Footer from "./Footer"

interface AppLayoutProps {
	children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="min-h-screen relative flex flex-col bg-slate-950">
			{/* animated gradient background */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-40"
				style={{
					background:
						"radial-gradient(1000px circle at 10% 0%, rgba(59,130,246,0.15), transparent 40%), radial-gradient(900px circle at 90% 10%, rgba(168,85,247,0.12), transparent 40%), radial-gradient(900px circle at 50% 100%, rgba(34,197,94,0.10), transparent 40%)",
				}}
			/>
			<Header />
			<main className="flex-1 relative z-10">{children}</main>
			<Footer />
		</div>
	)
}
