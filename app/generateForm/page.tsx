"use client";

import { useRef, useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { IoPrintSharp } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import Content from "@/components/Content";
import { format } from "date-fns";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

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

const GenerateForm = () => {
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
    pageNo: "",
    village: "",
    postOffice: "",
    police: "",
    district: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [headerInfoData, setHeaderInfoData] = useState(initialFormData);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const printRef = useRef<HTMLDivElement>(null);
  const printBlankRef = useRef<HTMLDivElement>(null);
  const rowsPerPage = 8; // Set this value based on your design

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
        }
      };
    }
  };

  const generatePDF = useReactToPrint({
    contentRef: printRef, // Pass the ref here
    documentTitle: "KCC Form With Data",
  });

  const generateBlankPDF = useReactToPrint({
    contentRef: printBlankRef, // Pass the ref here
    documentTitle: "KCC Form Without Data",
  });

  // Paginate the data
  const paginatedData = Array.from(
    { length: Math.ceil(data.length / rowsPerPage) },
    (_, pageIndex) => {
      return data.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);
    }
  );

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
    if (!formData.pageNo) {
      newErrors.pageNo = "পৃষ্ঠা নং is required";
    } else if (!/^\d+$/.test(formData.pageNo)) {
      newErrors.pageNo = "পৃষ্ঠা নং must be a number";
    }
    if (!formData.village) newErrors.village = "গ্রাম is required";
    if (!formData.postOffice) newErrors.postOffice = "ডাকঘর is required";
    if (!formData.police) newErrors.police = "থানা is required";
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
    <div className="w-screen h-full py-10 flex flex-col gap-5 px-20">
      <div className="w-full flex items-center justify-between gap-5">
        <Link
          href={"/tamshukForm"}
          className="px-5 py-3 rounded-md bg-blue-500 text-white font-semibold"
        >
          Go To Tamshuk Form
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
          <label htmlFor="pageNo">পৃষ্ঠা নং</label>
          <input
            type="text"
            id="pageNo"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.pageNo}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.pageNo && (
            <span className="text-red-500 text-sm">{errors.pageNo}</span>
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
          <label htmlFor="postOffice">ডাকঘর</label>
          <input
            type="text"
            id="postOffice"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.postOffice}
            onChange={handleChange}
            disabled={showForm || showBlankForm}
          />
          {errors.postOffice && (
            <span className="text-red-500 text-sm">{errors.postOffice}</span>
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
          {errors.police && (
            <span className="text-red-500 text-sm">{errors.police}</span>
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
        <div className="w-full flex justify-end items-end">
          <button
            className="w-1/2 bg-blue-500 text-white rounded-md py-3 font-semibold disabled:bg-gray-400"
            disabled={showForm || showBlankForm}
          >
            Update
          </button>
        </div>
      </form>

      <div className="w-[343mm] flex items-center justify-center gap-10 m-auto p-5">
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
          <div className="w-[343mm] flex justify-end items-center font-roboto">
            <button
              className="px-8 py-2 bg-blue-500 text-white text-xl flex items-center gap-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => generateBlankPDF()}
            >
              Print <IoPrintSharp className="text-2xl" />
            </button>
          </div>

          <div className="w-[343mm]" ref={printBlankRef}>
            <div className="w-[343mm] h-[215mm] bg-white p-4 shadow-[10px_10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-1 relative">
              {/* The content structure here remains the same as in your App component */}
              <div className="w-full h-full flex flex-col border border-black space-y-1 py-2 justify-between">
                <div className="w-full">
                  <div className="w-full px-2">
                    <p className="text-wrap mt-2">
                      <span className="relative">
                        সমিতির নাম
                        ............................................................................................................................
                        <span className="absolute left-24">
                          {headerInfoData.samitiName}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        রেজি: নং ..........................................
                        <span className="absolute left-20">
                          {headerInfoData.regNo}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        তাং ............................
                        <span className="absolute left-10">
                          {format(headerInfoData.date, "dd-MM-yyyy")}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        পৃষ্ঠা নং ........................
                        <span className="absolute left-16">
                          {headerInfoData.pageNo}
                        </span>
                      </span>{" "}
                      <br />
                      <span className="relative">
                        ঠিকানা : গ্রাম
                        .......................................................
                        <span className="absolute left-24">
                          {headerInfoData.village}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        ডাকঘর ...............................................
                        <span className="absolute left-16">
                          {headerInfoData.postOffice}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        থানা .............................................
                        <span className="absolute left-12">
                          {headerInfoData.police}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        জেলা
                        ....................................................
                        <span className="absolute left-12">
                          {headerInfoData.district}
                        </span>
                      </span>{" "}
                      <span className="text-lg font-semibold">
                        শস্য চাষের জন্য
                      </span>
                    </p>
                  </div>

                  <div className="w-full p-2">
                    <table className="table-auto border-collapse border border-gray-400 w-full">
                      <thead>
                        <tr>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            rowSpan={2}
                          >
                            ক্রমিক সংখ্যা
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1 w-[120px]"
                            rowSpan={2}
                          >
                            সভ্যের নাম ও পিতার নাম
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            colSpan={6}
                          >
                            ব্যাঙ্ক কর্তৃক মঞ্জুরীকৃত কর্জ গ্রহণের সীমা
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            colSpan={2}
                          >
                            পূর্বের ঋণ পরিশোধের বিবরণ
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            স্বল্প মেয়াদী কর্জ বাবদ বর্তমান সমিতিতে দেনার পরিমাণ
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            colSpan={4}
                          >
                            প্রার্থিক অর্থের পরিমাণ
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            rowSpan={2}
                          >
                            সভ্যের স্বাক্ষর অথবা টিপসহ
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            colSpan={4}
                          >
                            মঞ্জুরীকৃত অর্থের পরিমাণ
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            rowSpan={2}
                          >
                            মন্তব্য
                          </th>
                        </tr>
                        <tr>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            ক্রেডিট লিমিট পত্রের ক্রমিক নং
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            নগদে
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            বস্তুতে
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            শস্য বীমা
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            মোট
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            সমিতির ক্রিত শেয়ারের পরিমান
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[80px]">
                            তারিখ
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[80px]">
                            টাকা
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            চলতি
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            নগদ অর্থ
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            বস্তুতে
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            শস্য বীমা
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            মোট
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            নগদ অর্থ
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            বস্তুতে
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            শস্য বীমা
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            মোট
                          </th>
                        </tr>
                        <tr>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[50px]">
                            ১
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[120px]">
                            ২
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[50px]">
                            ৩
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ৪
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ৫
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ৬
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[80px]">
                            ৭
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[50px]">
                            ৮
                          </th>
                          <th
                            className="border border-gray-400 text-xs font-medium p-1"
                            colSpan={2}
                          >
                            ৯
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[84px]">
                            ১০
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ১১
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ১২
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ১৩
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[80px]">
                            ১৪
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[120px]">
                            ১৫
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ১৬
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ১৭
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[45px]">
                            ১৮
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1 w-[80px]">
                            ১৯
                          </th>
                          <th className="border border-gray-400 text-xs font-medium p-1">
                            ২০
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 8 }).map((_, index) => (
                          <tr key={index}>
                            <td className="border border-gray-400 text-xs p-1 h-12 text-center"></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                            <td className="border border-gray-400 text-xs px-1 "></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 justify-self-end w-full text-sm">
                  <div className="flex flex-col gap-8 justify-end items-end">
                    <p className="relative">
                      <span className="absolute left-5">
                        {headerInfoData.samitiName}
                      </span>
                      ............................................................................................................
                      সমিতির পক্ষ্যে
                    </p>{" "}
                    <div className="flex items-center justify-between w-full gap-10">
                      <p>সম্পাদক</p>
                      <p>সভাপতি</p>
                      <p>সুপারভাইজারের স্বাক্ষর</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 justify-end items-start w-[50%%]">
                    <p className="">
                      উপরোক্ত সভ্য গণের পূর্বে লওয়া করজের কর্জের খেলাপী বাকি
                      নাই
                    </p>{" "}
                    <div className="flex items-center justify-between w-full gap-10">
                      <p>বিভাগীয় কর্মচারীর স্বাক্ষর</p>
                      <p>সেন্ট্রাল ব্যাংকের ম্যানেজারের স্বাক্ষর</p>
                      <p>
                        সেন্ট্রাল ব্যাংকের মুখ্য নির্বাহী আধিকারিকের সাক্ষাৎ
                        সাক্ষর
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="w-full h-full flex flex-col items-center py-10 gap-10 font-bengali">
          <div className="w-[343mm] flex justify-between items-center font-roboto">
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

          <div className="w-[343mm]" ref={printRef}>
            {paginatedData.map((pageData, index) => (
              <Content key={index} data={pageData} formData={headerInfoData} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateForm;
