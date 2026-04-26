import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stratifyr" },
      { name: "description", content: "Stratifyr is a marketing planning platform designed for small business owners and entrepreneurs. It helps you manage your marketing budget, schedule campaigns," },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Stratifyr" },
      { property: "og:description", content: "Stratifyr is a marketing planning platform designed for small business owners and entrepreneurs. It helps you manage your marketing budget, schedule campaigns," },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Stratifyr" },
      { name: "twitter:description", content: "Stratifyr is a marketing planning platform designed for small business owners and entrepreneurs. It helps you manage your marketing budget, schedule campaigns," },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7pU9cfjxeUMRwb4GeYeGT8wnKM33/social-images/social-1777180792158-website_img_2.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7pU9cfjxeUMRwb4GeYeGT8wnKM33/social-images/social-1777180792158-website_img_2.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
