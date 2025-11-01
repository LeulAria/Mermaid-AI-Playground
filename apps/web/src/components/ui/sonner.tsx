"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme="dark"
			className="toaster group"
			toastOptions={{
				style: {
					background: "#101010",
					color: "#ffffff",
					border: "1px solid rgba(255, 255, 255, 0.1)",
				},
			}}
			style={
				{
					"--normal-bg": "#101010",
					"--normal-text": "#ffffff",
					"--normal-border": "rgba(255, 255, 255, 0.1)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
