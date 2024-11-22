"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import * as XLSX from "xlsx";
import { IoPrintSharp } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import LogoutButton from "@/components/LogoutButton";
import TamshukContent from "@/components/TamshukContent";
import Link from "next/link";

const font = Noto_Sans_Bengali({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

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

const TamshukForm = () => {
  const [data, setData] = useState<Info[]>([]);
  const [showBlankForm, setShowBlankForm] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [withoutButtonDisable, setWithoutButtonDisable] =
    useState<boolean>(true);
  const [withButtonDisable, setWithButtonDisable] = useState<boolean>(true);

  const initialFormData = {
    samitiName: "",
    regNo: "",
    date: "",
    village: "",
    police: "",
    district: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [headerInfoData, setHeaderInfoData] = useState(initialFormData);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const printRef = useRef<HTMLDivElement>(null);
  const printBlankRef = useRef<HTMLDivElement>(null);
  // const rowsPerPage = 8; // Set this value based on your design

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const binaryStr = e.target?.result;
        if (typeof binaryStr === "string") {
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json<Info>(sheet);

          setData(parsedData);
          console.log(parsedData);
        }
      };
    }
  };

  const generatePDF = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
      @page {
        size: A4;
        margin: 0;
      }
      body {
        font-family: 'Noto Sans Bengali', sans-serif;
        color: white;
      }
    `,
  });

  const generateBlankPDF = useReactToPrint({
    content: () => printBlankRef.current,
    pageStyle: `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
      @page {
        size: A4;
        margin: 0;
      }
      body {
        font-family: 'Noto Sans Bengali', sans-serif;
      }
    `,
  });

  // Handle change for form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Update corresponding field in state
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.samitiName) newErrors.samitiName = "সমিতির নাম is required";
    if (!formData.regNo) newErrors.regNo = "রেজি: নং is required";
    if (!formData.date) newErrors.date = "তাং is required";
    if (!formData.village) newErrors.village = "গ্রাম is required";
    if (!formData.police) newErrors.block = "থানা is required";
    if (!formData.district) newErrors.district = "জেলা is required";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors in state if validation fails
    } else {
      setErrors({}); // Clear errors if validation passes
      setHeaderInfoData(formData);
      setFormData(initialFormData);
      setWithButtonDisable(false);
      setWithoutButtonDisable(false);
    }
  };

  return (
    <div
      className={`w-screen h-full py-10 flex flex-col gap-5 px-20 ${font.className}`}
    >
      <div className="w-full flex items-center justify-between gap-5">
        <Link
          href={"/generateForm"}
          className="px-5 py-3 rounded-md bg-blue-500 text-white font-semibold"
        >
          Go To KCC Form
        </Link>
        <LogoutButton className=" px-5 py-3 rounded-md bg-red-500 text-white font-semibold" />
      </div>

      <form
        className="w-[356mm] grid grid-cols-3 gap-5 m-auto border border-black rounded-md p-5"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex gap-2 flex-col">
          <label htmlFor="samitiName">সমিতির নাম</label>
          <input
            type="text"
            id="samitiName"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.samitiName}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.samitiName && (
            <span className="text-red-500 text-sm">{errors.samitiName}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="regNo">রেজি: নং</label>
          <input
            type="text"
            id="regNo"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.regNo}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.regNo && (
            <span className="text-red-500 text-sm">{errors.regNo}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="date">তাং</label>
          <input
            type="date"
            id="date"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.date}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.date && (
            <span className="text-red-500 text-sm">{errors.date}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="village">গ্রাম</label>
          <input
            type="text"
            id="village"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.village}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.village && (
            <span className="text-red-500 text-sm">{errors.village}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="police">থানা</label>
          <input
            type="text"
            id="police"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.police}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.block && (
            <span className="text-red-500 text-sm">{errors.block}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="district">জেলা</label>
          <input
            type="text"
            id="district"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.district}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.district && (
            <span className="text-red-500 text-sm">{errors.district}</span>
          )}
        </div>
        <div className="w-full flex justify-end items-end col-span-3">
          <button
            className="w-1/6 bg-blue-500 text-white rounded-md py-3 font-semibold disabled:bg-gray-400"
            disabled={showForm || showBlankForm}
          >
            Update
          </button>
        </div>
      </form>

      <div className="w-[356mm] flex items-center justify-center gap-10 m-auto p-5">
        <button
          className="w-[300px] bg-blue-500 text-white rounded-md py-3 font-semibold disabled:bg-gray-400"
          disabled={withoutButtonDisable}
          onClick={() => {
            setShowBlankForm(true);
            setShowForm(false);
          }}
        >
          Print Without Data
        </button>
        <button
          className="w-[300px] bg-blue-500 text-white rounded-md py-3 font-semibold disabled:bg-gray-400"
          disabled={withButtonDisable}
          onClick={() => {
            setShowForm(true);
            setShowBlankForm(false);
          }}
        >
          Print With Data
        </button>
      </div>
      {showBlankForm && (
        <div className="w-full h-full flex flex-col items-center py-10 gap-10 font-bengali">
          <div className="w-[210mm] flex justify-end items-center font-roboto">
            <button
              className="px-8 py-2 bg-blue-500 text-white text-xl flex items-center gap-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={generateBlankPDF}
            >
              Print <IoPrintSharp className="text-2xl" />
            </button>
          </div>

          <div className="w-[210mm]" ref={printBlankRef}>
            <div className="w-[210mm] h-[297mm] bg-white p-4 shadow-[10px_10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-1 relative">
              {/* The content structure here remains the same as in your App component */}
              <div className="w-full h-full flex flex-col border border-black space-y-1 px-5">
                <div className="w-full border-b-2 border-black border-dashed py-2">
                  <div className="w-full text-center flex flex-col">
                    <h3 className="text-3xl font-semibold mb-1">
                      {headerInfoData.samitiName}
                    </h3>
                    <p className="text-lg font-semibold">
                      রেজিঃ নং - {headerInfoData.regNo} এইচ.জি :: তাং-{" "}
                      {format(headerInfoData.date, "dd-MM-yyyy")}
                    </p>
                    <p className="text-xl font-semibold">
                      {headerInfoData.village} &diams; {headerInfoData.police}{" "}
                      &diams; {headerInfoData.district}
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
                        আমি শ্রী / শ্রীমতি
                        .......................................
                        <br />
                      </span>
                      .......................................................................{" "}
                      <span className="relative">
                        পিতা / স্বামী
                        .........................................................................
                      </span>{" "}
                      <span className="relative">
                        গ্রাম - .........................
                      </span>
                      ,
                      <span className="relative">
                        পোঃ - .........................
                      </span>
                      ,
                      <span className="relative">
                        ব্লক - .........................
                      </span>
                      ,
                      <span className="relative">
                        জিলা - .........................
                      </span>{" "}
                      <span className="font-semibold">
                        {headerInfoData.samitiName}
                      </span>
                      -এর সভ্য এবং{" "}
                      <span className="relative">
                        ..................................
                      </span>{" "}
                      নং কৃষাণ ক্রেডিট কার্ডের অধিকারী। বিভিন্ন ফসলের জন্য আমি
                      সমিতির থেকে সর্বাধিক{" "}
                      <span className="relative">
                        ..................................................
                      </span>{" "}
                      টাকা ঋণ শতকরা{" "}
                      <span className="relative">
                        ................................
                        <span className="absolute left-4 bottom-[2px]">
                          7 to 10.50%
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
                        </span>
                      </div>
                      <div>
                        <p className="mb-2 relative">
                          তারিখ .............................{" "}
                        </p>
                        <p>সমিতির ভারপ্রাপ্ত আধিকারিকের স্বাক্ষর </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center gap-24 text-center pt-2">
                    <div>
                      <p>ম্যানেজার</p>
                      <p className="text-sm">{headerInfoData.samitiName}</p>
                    </div>
                    <div>
                      <p>সম্পাদক</p>
                      <p className="text-sm">{headerInfoData.samitiName}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full py-2">
                  <div className="w-full text-center flex flex-col">
                    <p className="font-semibold relative">
                      ................. LIMIT .................
                    </p>
                    <h3 className="text-3xl font-semibold mb-1">
                      {headerInfoData.samitiName}
                    </h3>
                    <p className="text-lg font-semibold">
                      রেজিঃ নং - {headerInfoData.regNo} এইচ.জি :: তাং-{" "}
                      {format(headerInfoData.date, "dd-MM-yyyy")}
                    </p>
                  </div>
                  <div className="w-full ">
                    <div className="w-full text-center font-semibold  mb-2 flex items-center justify-between">
                      <p>L.F. ....................</p>
                      <h2 className=" text-xl underline">ভাউচার</h2>
                      <p className="relative">C.L. ....................</p>
                    </div>

                    <p className="w-full mb-2">
                      <span className="text-lg font-semibold">
                        {headerInfoData.samitiName}
                      </span>{" "}
                      <span className="relative">
                        আমি শ্রী / শ্রীমতি
                        .............................................
                      </span>{" "}
                      ...........................................................................{" "}
                      <span className="relative">
                        পিতা / স্বামী
                        .....................................................................
                      </span>{" "}
                      <span className="relative">
                        ক্রেডিট কার্ড হোল্ডিং নং
                        ............................................
                      </span>{" "}
                      আমি{" "}
                      <span className="font-semibold">
                        {headerInfoData.samitiName}
                      </span>
                      -এর নিকট হইতে
                      <span className="relative">
                        ....................................................................
                      </span>
                      নং কৃষাণ ক্রেডিট কার্ডের নির্ধারিত কর্জ সীমার মধ্য হইতে{" "}
                      <span className="relative">
                        ..................................
                      </span>{" "}
                      চাষের জন্য{" "}
                      <span className="relative">
                        ..............................
                      </span>{" "}
                      টাকা{" "}
                      <span className="relative">
                        (
                        ..........................................................
                        ........................................... ) নগদে
                        বুঝিয়া পাইলাম।
                      </span>
                    </p>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="relative">
                        টাকা ...............................................
                      </p>
                      <p className="relative">
                        তারিখ .............................................
                      </p>
                    </div>

                    <div className="text-center">
                      <p>
                        .....................................................
                      </p>
                      <p>কৃষাণ কার্ড হোল্ডারের স্বাক্ষর</p>
                      <p className="relative">
                        কার্ড নং -
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                    </span>{" "}
                    <span className="relative">
                      কথায়
                      ............................................................................
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
                        <p className="text-sm">{headerInfoData.samitiName}</p>
                      </div>
                      <div>
                        <p>সম্পাদক</p>
                        <p className="text-sm">{headerInfoData.samitiName}</p>
                      </div>
                    </div>
                  </div>
                  <p className="w-full text-center">
                    (উল্টো দিকে কার্ড হোল্ডারের স্বাক্ষর)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="w-full h-full flex flex-col items-center py-10 gap-10 font-bengali">
          <div className="w-[210mm] flex justify-between items-center font-roboto">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="placeholder:font-roboto"
            />
            <button
              disabled={data.length === 0}
              className="px-8 py-2 bg-blue-500 text-white text-xl flex items-center gap-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={generatePDF}
            >
              Print <IoPrintSharp className="text-2xl" />
            </button>
          </div>

          <div className="w-[210mm]" ref={printRef}>
            {data.map((item, index) => (
              <TamshukContent
                key={index}
                data={item}
                formData={headerInfoData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TamshukForm;
