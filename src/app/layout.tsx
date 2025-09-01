import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "BTriCode — Software, Sites, IoT & SEO", template: "%s | BTriCode" },
  description: "Engenharia de software, UX e SEO de elite. Performance e crescimento orgânico.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100">
        <Nav />
        <main className="min-h-[80vh]">{children}</main>
        
        <a
  href="https://wa.me/5511972790365?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20BTriCode"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition z-50"
  aria-label="WhatsApp BTriCode"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    className="w-7 h-7"
  >
    <path d="M16.027 3c-7.171 0-13 5.828-13 13 0 2.289.609 4.523 1.77 6.484L3 29l6.672-1.742c1.891 1.008 4.016 1.535 6.355 1.535h.002c7.17 0 13-5.828 13-13s-5.83-13-13-13zm0 23.75c-2.031 0-4.016-.535-5.762-1.547l-.414-.242-3.961 1.031 1.055-3.867-.27-.398C5.969 20.281 5.5 18.664 5.5 16c0-5.793 4.707-10.5 10.5-10.5 2.809 0 5.445 1.094 7.43 3.078S26.5 13.191 26.5 16c0 5.793-4.707 10.5-10.5 10.5zm5.703-7.82c-.312-.156-1.828-.902-2.109-1.004-.281-.105-.484-.156-.684.156s-.785 1.004-.961 1.211c-.176.211-.352.234-.664.078-.312-.156-1.32-.484-2.516-1.547-.93-.828-1.563-1.852-1.746-2.164-.184-.312-.02-.48.137-.637.141-.141.312-.367.469-.547.152-.184.203-.312.312-.52.105-.211.051-.391-.027-.547-.078-.156-.684-1.652-.937-2.262-.25-.602-.5-.52-.684-.531h-.586c-.203 0-.531.078-.809.391-.277.312-1.066 1.039-1.066 2.535s1.094 2.945 1.246 3.152c.152.211 2.148 3.281 5.203 4.602.727.312 1.293.5 1.734.641.727.23 1.387.195 1.91.117.582-.086 1.828-.746 2.086-1.465.258-.719.258-1.328.18-1.457-.074-.129-.27-.203-.582-.359z" />
  </svg>
</a>

        <Footer />
      </body>
    </html>
  );
}

