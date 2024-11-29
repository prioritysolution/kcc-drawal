import { format } from "date-fns";

interface Info {
  Block: string;
  Credit_Limit_No: number;
  Credit_card_No: number;
  Credit_limit_Amount: number;
  Crop_Limit_Amount: number;
  Crop_Name: string;
  Date: string;
  Dist: string;
  Gurdain_Name: string;
  Loan_Amount: number;
  Member_Name: string;
  Post: string;
  Village: string;
}
interface FormData {
  date: string;
  district: string;
  police: string;
  regNo: string;
  samitiName: string;
  village: string;
}

interface TamshukContentProps {
  data: Info;
  formData: FormData;
}

const TamshukContent: React.FC<TamshukContentProps> = ({ data, formData }) => {
  function convertToWords(num: number): string {
    if (num === 0) return "Zero";

    const units: string[] = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens: string[] = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const scales: string[] = ["", "Thousand", "Lakh", "Crore"];

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = num.toString().split(".");

    let words: string = convertIntegerPartToWords(
      parseInt(integerPart, 10),
      units,
      tens,
      scales
    );

    // Handle decimal part if present
    if (decimalPart) {
      words += " Point";
      for (const digit of decimalPart) {
        words += ` ${units[parseInt(digit, 10)]}`;
      }
    }

    return words.trim();
  }

  function convertIntegerPartToWords(
    num: number,
    units: string[],
    tens: string[],
    scales: string[]
  ): string {
    let words: string = "";
    // let scaleIndex = 0;

    const crore = Math.floor(num / 10000000);
    if (crore > 0) {
      words +=
        convertIntegerPartToWords(crore, units, tens, scales) + " Crore ";
      num %= 10000000;
    }

    const lakh = Math.floor(num / 100000);
    if (lakh > 0) {
      words += convertIntegerPartToWords(lakh, units, tens, scales) + " Lakh ";
      num %= 100000;
    }

    const thousand = Math.floor(num / 1000);
    if (thousand > 0) {
      words +=
        convertIntegerPartToWords(thousand, units, tens, scales) + " Thousand ";
      num %= 1000;
    }

    if (num > 0) {
      words += getPartInWords(num, units, tens);
    }

    return words.trim();
  }

  function getPartInWords(
    num: number,
    units: string[],
    tens: string[]
  ): string {
    let words: string = "";

    if (num >= 100) {
      words += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num >= 20) {
      words += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }

    if (num > 0) {
      words += units[num] + " ";
    }

    return words.trim();
  }

  return (
    <div className="w-[210mm] h-[297mm] bg-white p-4 shadow-[10px_10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-1 relative">
      {/* The content structure here remains the same as in your App component */}
      <div className="w-full h-full flex flex-col border border-black space-y-1 px-5">
        <div className="w-full border-b-2 border-black border-dashed py-2">
          <div className="w-full text-center flex flex-col">
            <h3 className="text-3xl font-semibold mb-1">
              {formData?.samitiName}
            </h3>
            <p className="text-lg font-semibold">
              রেজিঃ নং - {formData?.regNo} এইচ.জি :: তাং-{" "}
              {format(formData?.date, "dd-MM-yyyy")}
            </p>
            <p className="text-xl font-semibold">
              {formData?.village} &diams; {formData?.police} &diams;{" "}
              {formData?.district}
            </p>
          </div>
          <div className="w-full ">
            <h2 className="w-full text-center font-semibold text-xl underline mb-2">
              তমসুক
            </h2>
            <p className="w-full mb-2">
              <span className="text-lg font-semibold">
                অদ্য হইতে ১২ (বারো) মাসের মধ্যে পরিশোধের অঙ্গীকারে
              </span>{" "}
              <span className="relative">
                আমি শ্রী / শ্রীমতি .......................................
                <span className="absolute bottom-0 left-32 text-nowrap text-black">
                  {data?.Member_Name}
                </span>
                <br />
              </span>
              .......................................................................{" "}
              <span className="relative">
                পিতা / স্বামী
                .........................................................................
                <span className="absolute bottom-0 left-24 text-nowrap text-black">
                  {data?.Gurdain_Name}
                </span>
              </span>
              <span className="relative">
                গ্রাম - .........................
                <span className="absolute left-10 text-black text-sm bottom-0">
                  {data?.Village}
                </span>
              </span>
              ,
              <span className="relative">
                পোঃ - .........................
                <span className="absolute left-10 text-black text-sm bottom-0">
                  {data?.Post}
                </span>
              </span>
              ,
              <span className="relative">
                ব্লক - .........................
                <span className="absolute left-9 text-black text-sm bottom-0">
                  {data?.Block}
                </span>
              </span>
              ,
              <span className="relative">
                জিলা - .........................
                <span className="absolute left-12 text-black text-sm bottom-0">
                  {data?.Dist}
                </span>
              </span>{" "}
              <span className="font-semibold">{formData?.samitiName}</span>
              -এর সভ্য এবং{" "}
              <span className="relative">
                ..................................
                <span className="absolute left-5 text-black">
                  {data?.Credit_card_No}
                </span>
              </span>{" "}
              নং কৃষাণ ক্রেডিট কার্ডের অধিকারী। বিভিন্ন ফসলের জন্য আমি সমিতির
              থেকে সর্বাধিক{" "}
              <span className="relative">
                ..................................................
                <span className="absolute  left-5 text-black">
                  {data?.Credit_limit_Amount}
                </span>
              </span>{" "}
              টাকা ঋণ শতকরা{" "}
              <span className="relative">
                ................................
                <span className="absolute text-nowrap left-5 bottom-[2px]">
                  7 to 10.5%
                </span>
              </span>{" "}
              টাকা হার সুদে পরিশোধের অঙ্গীকারে এই অঙ্গীকারপত্র সুস্থ মনে
              স্বাক্ষর করিলাম।
            </p>
          </div>
          <div className="w-full flex justify-between items-center py-2">
            <div>
              <p>আমার সম্মুখে স্বাক্ষর করা হইল।</p>
              <div className="flex flex-col gap-1 mt-1">
                <p>সাক্ষী</p>
                <span>১।</span>
                <span>কার্ড নং</span>
                <span>২।</span>
                <span>কার্ড নং</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div>
                <p>সভ্য বা কার্ড হোল্ডারের স্বাক্ষর</p>
                <span className="relative">
                  কার্ড নং -
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="absolute left-16 text-black">
                    {data?.Credit_card_No}
                  </span>
                </span>
              </div>
              <div>
                <p className="mb-2 relative">
                  তারিখ .............................{" "}
                  <span className="absolute text-nowrap left-24 text-black">
                    {data?.Date}
                  </span>
                </p>
                <p>সমিতির ভারপ্রাপ্ত আধিকারিকের স্বাক্ষর </p>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-24 text-center pt-2">
            <div>
              <p>ম্যানেজার</p>
              <p className="text-sm">{formData?.samitiName}</p>
            </div>
            <div>
              <p>সম্পাদক</p>
              <p className="text-sm">{formData?.samitiName}</p>
            </div>
          </div>
        </div>
        <div className="w-full py-2">
          <div className="w-full text-center flex flex-col">
            <p className="font-semibold relative">
              ................. LIMIT .................
              <span className="absolute left-[270px] font-normal text-black">
                {data?.Crop_Name}
              </span>
              <span className="absolute right-[270px] font-normal text-black">
                {data?.Crop_Limit_Amount}
              </span>
            </p>
            <h3 className="text-3xl font-semibold mb-1">
              {formData?.samitiName}
            </h3>
            <p className="text-lg font-semibold">
              রেজিঃ নং - {formData?.regNo} এইচ.জি :: তাং-{" "}
              {format(formData?.date, "dd-MM-yyyy")}
            </p>
          </div>
          <div className="w-full ">
            <div className="w-full text-center font-semibold  mb-2 flex items-center justify-between">
              <p>L.F. ....................</p>
              <h2 className=" text-xl underline">ভাউচার</h2>
              <p className="relative">
                C.L. ....................
                <span className="absolute left-12 text-black">
                  {data?.Credit_Limit_No}
                </span>
              </p>
            </div>

            <p className="w-full mb-2">
              <span className="text-lg font-semibold">
                {formData?.samitiName}
              </span>{" "}
              <span className="relative">
                আমি শ্রী / শ্রীমতি .............................................
                <span className="absolute left-32 bottom-[26px] text-nowrap text-black">
                  {data?.Member_Name}
                </span>
              </span>
              ...........................................................................{" "}
              <span className="relative">
                পিতা / স্বামী
                .....................................................................
                <span className="absolute left-24 text-nowrap text-black">
                  {data?.Gurdain_Name}
                </span>
              </span>
              <span className="relative">
                ক্রেডিট কার্ড হোল্ডিং নং
                ............................................
                <span className="absolute left-40 text-black">
                  {data?.Credit_card_No}
                </span>
              </span>{" "}
              আমি <span className="font-semibold">{formData?.samitiName}</span>
              -এর নিকট হইতে
              <span className="relative">
                ....................................................................
                <span className="absolute left-8 text-black">
                  {data?.Credit_card_No}
                </span>
              </span>
              নং কৃষাণ ক্রেডিট কার্ডের নির্ধারিত কর্জ সীমার মধ্য হইতে{" "}
              <span className="relative">
                ..................................
                <span className="absolute left-5 text-black">
                  {data?.Crop_Name}
                </span>
              </span>{" "}
              চাষের জন্য{" "}
              <span className="relative">
                ..............................
                <span className="absolute left-5 text-black">
                  {data?.Loan_Amount}
                </span>
              </span>{" "}
              টাকা{" "}
              <span className="relative">
                ( ..........................................................
                ........................................... ) নগদে বুঝিয়া
                পাইলাম।
                {data.Loan_Amount && (
                  <span className="absolute left-10 bottom-6 text-nowrap text-black">
                    {convertToWords(data.Loan_Amount)} Only
                  </span>
                )}
              </span>
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <div>
              <p className="relative">
                টাকা ...............................................
                <span className="absolute left-12 text-black">
                  {data?.Loan_Amount}
                </span>
              </p>
              <p className="relative">
                তারিখ .............................................
                <span className="absolute left-12 text-black">
                  {data?.Date}
                </span>
              </p>
            </div>

            <div className="text-center">
              <p>.....................................................</p>
              <p>কৃষাণ কার্ড হোল্ডারের স্বাক্ষর</p>
              <p className="relative">
                কার্ড নং -
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="absolute left-32 text-black">
                  {data?.Credit_card_No}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full border-t-2 border-black h-full py-2 relative">
          <p className="absolute -top-[13px] left-1/2 transform -translate-x-1/2 bg-white px-2">
            অফিস ব্যাবহার
          </p>
          <p>
            <span className="relative">
              টাকা .................................
              <span className="absolute left-12 text-black">
                {data?.Loan_Amount}
              </span>
            </span>{" "}
            <span className="relative">
              কথায়
              ............................................................................
              {data.Loan_Amount && (
                <span className="absolute left-16 text-nowrap text-black">
                  {convertToWords(data.Loan_Amount)} Only
                </span>
              )}
            </span>
            মঞ্জুর করা হল।
          </p>
          <div className="w-full flex flex-col gap-4 py-2">
            <p className="w-full text-end">
              সমিতির ভারপ্রাপ্ত আধিকারিকের স্বাক্ষর
            </p>
            <div className="w-full flex items-center justify-center gap-24 text-center">
              <div>
                <p>ম্যানেজার</p>
                <p className="text-sm">{formData?.samitiName}</p>
              </div>
              <div>
                <p>সম্পাদক</p>
                <p className="text-sm">{formData?.samitiName}</p>
              </div>
            </div>
          </div>
          <p className="w-full text-center">
            (উল্টো দিকে কার্ড হোল্ডারের স্বাক্ষর)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TamshukContent;
