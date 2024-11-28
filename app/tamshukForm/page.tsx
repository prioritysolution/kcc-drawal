"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import * as XLSX from "xlsx";
import { IoPrintSharp } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
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
  const [showForm, setShowForm] = useState<boolean>(false);

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
    contentRef: printRef, // Pass the ref here
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
    documentTitle: "Tamshuk Form With Data",
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
      setShowForm(true);
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
            disabled={showForm}
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
            disabled={showForm}
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
            disabled={showForm}
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
            disabled={showForm}
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
            disabled={showForm}
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
            disabled={showForm}
          />
          {errors.district && (
            <span className="text-red-500 text-sm">{errors.district}</span>
          )}
        </div>
        <div className="w-full flex justify-end items-end col-span-3">
          <button
            className="w-1/6 bg-blue-500 text-white rounded-md py-3 font-semibold disabled:bg-gray-400"
            disabled={showForm}
          >
            Update
          </button>
        </div>
      </form>

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
              onClick={() => generatePDF()}
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
