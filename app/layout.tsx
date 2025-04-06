import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
// import { env } from '@xenova/transformers';

// // Set the backend to 'onnxruntime-web'
// env.backends.onnx.wasm.wasmPaths = '/path/to/wasm/files/'; // Optional: Specify the path to WASM files
// env.backends.onnx.wasm.numThreads = 1; // Optional: Set the number of threads
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
