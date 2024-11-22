import { format } from "date-fns";

interface Info {
  Aadhar_No: string;
  Credit_Limit_Amount: number;
  Credit_Limit_No: string;
  Fathers_Name: string;
  Last_Crop_Loan_Due: number;
  Name_of_Members: string;
  New_Loan_Disbursed_Amount: number;
  New_Loan_Disbursed_Date: string;
  Old_Loan_Amount: number;
  Old_Loan_Issued_Date: string;
  Old_Loan_Repaid_full_on: string;
  Sl_No: number;
}
interface FormData {
  date: string;
  district: string;
  pageNo: string;
  police: string;
  postOffice: string;
  regNo: string;
  samitiName: string;
  village: string;
}

interface ContentProps {
  data: Info[];
  formData: FormData;
}

const Content: React.FC<ContentProps> = ({ data, formData }) => {
  function fixDecimal(value: number) {
    const [integerPart, decimalPart] = value.toString().split(".");
    if (!decimalPart) {
      return `${integerPart}.00`; // No decimal part, return with .00
    }
    // Ensure the decimal part is exactly two digits
    return `${integerPart}.${decimalPart.padEnd(2, "0").slice(0, 2)}`;
  }

  return (
    <div className="w-[343mm] h-[215mm] bg-white p-4 shadow-[10px_10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-1 relative">
      {/* The content structure here remains the same as in your App component */}
      <div className="w-full h-full flex flex-col border border-transparent space-y-1 py-2 justify-between">
        <div className="w-full">
          <div className="w-full px-2 opacity-0">
            <p className="text-wrap mt-2">
              <span className="relative">
                সমিতির নাম
                ............................................................................................................................
                <span className="absolute left-24">{formData.samitiName}</span>
              </span>{" "}
              <span className="relative">
                রেজি: নং ..........................................
                <span className="absolute left-20">{formData.regNo}</span>
              </span>{" "}
              <span className="relative">
                তাং ............................
                <span className="absolute left-10">
                  {format(formData.date, "dd-MM-yyyy")}
                </span>
              </span>{" "}
              <span className="relative">
                পৃষ্ঠা নং ........................
                <span className="absolute left-16">{formData.pageNo}</span>
              </span>{" "}
              <br />
              <span className="relative">
                ঠিকানা : গ্রাম
                .......................................................
                <span className="absolute left-24">{formData.village}</span>
              </span>{" "}
              <span className="relative">
                ডাকঘর ...............................................
                <span className="absolute left-16">{formData.postOffice}</span>
              </span>{" "}
              <span className="relative">
                থানা .............................................
                <span className="absolute left-12">{formData.police}</span>
              </span>{" "}
              <span className="relative">
                জেলা ....................................................
                <span className="absolute left-12">{formData.district}</span>
              </span>{" "}
              <span className="text-lg font-semibold">শস্য চাষের জন্য</span>
            </p>
          </div>

          <div className="w-full p-2">
            <table className="table-auto border-collapse border border-transparent w-full">
              <thead className="opacity-0">
                <tr>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    rowSpan={2}
                  >
                    ক্রমিক সংখ্যা
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    rowSpan={2}
                  >
                    সভ্যের নাম ও পিতার নাম
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    colSpan={6}
                  >
                    ব্যাঙ্ক কর্তৃক মঞ্জুরীকৃত কর্জ গ্রহণের সীমা
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    colSpan={2}
                  >
                    পূর্বের ঋণ পরিশোধের বিবরণ
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    স্বল্প মেয়াদী কর্জ বাবদ বর্তমান সমিতিতে দেনার পরিমাণ
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    colSpan={4}
                  >
                    প্রার্থিক অর্থের পরিমাণ
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    rowSpan={2}
                  >
                    সভ্যের স্বাক্ষর অথবা টিপসহ
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    colSpan={4}
                  >
                    মঞ্জুরীকৃত অর্থের পরিমাণ
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    rowSpan={2}
                  >
                    মন্তব্য
                  </th>
                </tr>
                <tr>
                  <th className="border border-transparent text-xs font-medium p-1">
                    ক্রেডিট লিমিট পত্রের ক্রমিক নং
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    নগদে
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    বস্তুতে
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    শস্য বীমা
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    মোট
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    সমিতির ক্রিত শেয়ারের পরিমান
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[80px]">
                    তারিখ
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[80px]">
                    টাকা
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    চলতি
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    নগদ অর্থ
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    বস্তুতে
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    শস্য বীমা
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    মোট
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    নগদ অর্থ
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    বস্তুতে
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    শস্য বীমা
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    মোট
                  </th>
                </tr>
                <tr>
                  <th className="border border-transparent text-xs font-medium p-1 w-[50px]">
                    ১
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[120px]">
                    ২
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[50px]">
                    ৩
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ৪
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ৫
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ৬
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[80px]">
                    ৭
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[50px]">
                    ৮
                  </th>
                  <th
                    className="border border-transparent text-xs font-medium p-1"
                    colSpan={2}
                  >
                    ৯
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[84px]">
                    ১০
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ১১
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ১২
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ১৩
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[80px]">
                    ১৪
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[120px]">
                    ১৫
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ১৬
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ১৭
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[45px]">
                    ১৮
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1 w-[80px]">
                    ১৯
                  </th>
                  <th className="border border-transparent text-xs font-medium p-1">
                    ২০
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-transparent text-xs p-1 h-12 text-center">
                      {item.Sl_No}
                    </td>
                    <td className="border border-transparent text-xs px-1">
                      {item.Name_of_Members}
                      <br />
                      {item.Fathers_Name}
                    </td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.Credit_Limit_No}
                    </td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.Credit_Limit_Amount &&
                        fixDecimal(item.Credit_Limit_Amount)}
                    </td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.Old_Loan_Repaid_full_on}
                    </td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.Old_Loan_Amount && fixDecimal(item.Old_Loan_Amount)}
                    </td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.Last_Crop_Loan_Due &&
                        fixDecimal(item.Last_Crop_Loan_Due)}
                    </td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.New_Loan_Disbursed_Amount &&
                        fixDecimal(item.New_Loan_Disbursed_Amount)}
                    </td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 "></td>
                    <td className="border border-transparent text-xs px-1 ">
                      {item.New_Loan_Disbursed_Amount &&
                        fixDecimal(item.New_Loan_Disbursed_Amount)}
                    </td>
                    <td className="border border-transparent text-xs px-1 "></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center p-2 justify-self-end w-full text-sm opacity-0">
          <div className="flex flex-col gap-8 justify-end items-end">
            <p className="">
              ............................................................................................................
              সমিতির পক্ষ্যে
            </p>{" "}
            <div className="flex items-center justify-between w-full gap-10">
              <p>সম্পাদক</p>
              <p>সভাপতি</p>
              <p>সুপারভাইজারের স্বাক্ষর</p>
            </div>
          </div>

          <div className="flex flex-col gap-8 justify-end items-start w-[60%]">
            <p className="">
              উপরোক্ত সভ্য গণের পূর্বে লওয়া করজের কর্জের খেলাপী বাকি নাই
            </p>{" "}
            <div className="flex items-center justify-between w-full gap-10">
              <p>বিভাগীয় কর্মচারীর স্বাক্ষর</p>
              <p>সেন্ট্রাল ব্যাংকের ম্যানেজারের স্বাক্ষর</p>
              <p>সেন্ট্রাল ব্যাংকের মুখ্য নির্বাহী আধিকারিকের সাক্ষাৎ সাক্ষর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
