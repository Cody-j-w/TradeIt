type Props = {
    children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="favicon.ico" />
            </head>
            <body className={`antialiased  bg-[#00003c] text-white min-h-screen`}>
                {children}
            </body>
        </html>
    );
}
