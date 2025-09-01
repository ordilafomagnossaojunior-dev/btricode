export default async function sitemap() {
const base = process.env.NEXT_PUBLIC_SITE_URL!;
return [
{ url: `${base}/`, changefreq: 'weekly', priority: 1.0 },
{ url: `${base}/servicos` },
{ url: `${base}/portfolio` },
{ url: `${base}/duvidas` },
{ url: `${base}/iot-lab` },
{ url: `${base}/apoio` },
{ url: `${base}/converse-com-po` },
{ url: `${base}/pergunte-seo` },
{ url: `${base}/contato` },
];
}