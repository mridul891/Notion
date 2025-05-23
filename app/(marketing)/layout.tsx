import { Navbar } from "./_components/Navbar";

const MarketingLayout = ({ children }: { childre: React.ReactNode }) => {
  return (
    <div className="h-full dark:bg-[#161618]">
      <Navbar />
      <main className="h-full pt-15 md:pt-20 ">{children}</main>
    </div>
  );
};
export default MarketingLayout;
