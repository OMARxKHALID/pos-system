import { ReduxProvider } from "@/providers/redux-provider";
import "./globals.css";

export const metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
};
export default RootLayout;
