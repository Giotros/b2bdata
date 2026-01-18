import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "B2B Data Tracker - Monitor Supplier Prices & Inventory",
  description = "Free tool to track supplier pricing and inventory changes over time. Compare XML snapshots to identify trending products and make data-driven purchasing decisions.",
  keywords = "supplier tracking, inventory tracking, price monitoring, XML snapshot, product trends, supplier comparison, e-commerce tools, B2B data",
  canonicalPath = "/",
  ogImage = "https://b2bdata.net/favicon.svg"
}) => {
  const fullUrl = `https://b2bdata.net${canonicalPath}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
