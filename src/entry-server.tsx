import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export { llmsTxt, personJsonLd, SITE_URL } from "./seo";

// Renders the page to HTML at build time, so crawlers that don't run JavaScript still see the content.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
