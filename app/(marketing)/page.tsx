import { Footer } from "./_components/Footer";
import Heading from "./_components/Heading";
import { Heroes } from "./_components/Heroes";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col ">
      <div className=" h-full flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 py-10 ">
            <Heading />
            <Heroes/>
      </div>
      <Footer/>
    </div>
  );
};

export default MarketingPage;
