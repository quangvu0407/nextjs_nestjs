import HeaderPage from "@/components/homePage/header";
import FooterPage from "@/components/homePage/footer";
import AuthGuard from "@/components/auth/AuthGuard";
import { auth } from "@/auth";

const MainLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AuthGuard />
      <HeaderPage session={session} />
      <main style={{ flex: 1 }}>{children}</main>
      <FooterPage />
    </div>
  );
}

export default MainLayout