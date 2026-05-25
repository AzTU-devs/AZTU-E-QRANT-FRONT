import { HelmetProvider, Helmet } from "react-helmet-async";

const SITE_URL = "https://e-grant.aztu.edu.az";
const DEFAULT_IMAGE = `${SITE_URL}/e-grant-logo-light.png`;
const SITE_NAME = "AzTU E-Qrant";

type PageMetaProps = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
};

const PageMeta = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
}: PageMetaProps) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = url
    ? url.startsWith("http")
      ? url
      : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`
    : typeof window !== "undefined"
    ? window.location.href
    : SITE_URL;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="az_AZ" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:alt" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={SITE_NAME} />
    </Helmet>
  );
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
