"use client";

import { useRef, useState } from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import { IoPrintSharp } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

const font = Noto_Sans_Bengali({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const TamshukForm = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const initialFormData = {
    samitiName: "",
    regNo: "",
    date: "",
    village: "",
    police: "",
    district: "",
    name: "",
    cVillage: "",
    cPost: "",
    cBlock: "",
    cDistrict: "",
    creditLimitNo: "",
    creditCardNo: "",
    creditLimitAmount: "",
    cropLimitAmount: "",
    cropName: "",
    cDate: "",
    gurdianName: "",
    loanAmount: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [headerInfoData, setHeaderInfoData] = useState(initialFormData);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const printRef = useRef<HTMLDivElement>(null);
  // const rowsPerPage = 8; // Set this value based on your design

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
    documentTitle: "Tamshuk Form Without Data",
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
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.cVillage) newErrors.cVillage = "Member Village is required";
    if (!formData.cPost) newErrors.cPost = "Member Post is required";
    if (!formData.cBlock) newErrors.cBlock = "Member Block is required";
    if (!formData.cDistrict)
      newErrors.cDistrict = "Member District is required";
    if (!formData.creditLimitNo)
      newErrors.creditLimitNo = "Credit limit no. is required";
    if (!formData.creditCardNo)
      newErrors.creditCardNo = "Credit card no. is required";
    if (!formData.creditLimitAmount)
      newErrors.creditLimitAmount = "Credit limit amount is required";
    if (!formData.cropLimitAmount)
      newErrors.cropLimitAmount = "Crop limit amount is required";
    if (!formData.cropName) newErrors.cropName = "Crop name is required";
    if (!formData.cDate) newErrors.cDate = "Date is required";
    if (!formData.gurdianName)
      newErrors.gurdianName = "Gurdian name is required";
    if (!formData.loanAmount) newErrors.loanAmount = "Loan amount is required";

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
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.name}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="gurdianName">Gurdian Name</label>
          <input
            type="text"
            id="gurdianName"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.gurdianName}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.gurdianName && (
            <span className="text-red-500 text-sm">{errors.gurdianName}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cVillage">Member Village</label>
          <input
            type="text"
            id="cVillage"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cVillage}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cVillage && (
            <span className="text-red-500 text-sm">{errors.cVillage}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cPost">Member Post</label>
          <input
            type="text"
            id="cPost"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cPost}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cPost && (
            <span className="text-red-500 text-sm">{errors.cPost}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cBlock">Member Block</label>
          <input
            type="text"
            id="cBlock"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cBlock}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cBlock && (
            <span className="text-red-500 text-sm">{errors.cBlock}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cDistrict">Member District</label>
          <input
            type="text"
            id="cDistrict"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cDistrict}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cDistrict && (
            <span className="text-red-500 text-sm">{errors.cDistrict}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="creditLimitNo">Credit Limit No</label>
          <input
            type="text"
            id="creditLimitNo"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.creditLimitNo}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.creditLimitNo && (
            <span className="text-red-500 text-sm">{errors.creditLimitNo}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="creditCardNo">Credit Card No</label>
          <input
            type="text"
            id="creditCardNo"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.creditCardNo}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.creditCardNo && (
            <span className="text-red-500 text-sm">{errors.creditCardNo}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="creditLimitAmount">Credit Limit Amount</label>
          <input
            type="text"
            id="creditLimitAmount"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.creditLimitAmount}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.creditLimitAmount && (
            <span className="text-red-500 text-sm">
              {errors.creditLimitAmount}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cropLimitAmount">Crop Limit Amount</label>
          <input
            type="text"
            id="cropLimitAmount"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cropLimitAmount}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cropLimitAmount && (
            <span className="text-red-500 text-sm">
              {errors.cropLimitAmount}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cropName">Crop Name</label>
          <input
            type="text"
            id="cropName"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cropName}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cropName && (
            <span className="text-red-500 text-sm">{errors.cropName}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="cDate">Member Date</label>
          <input
            type="date"
            id="cDate"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.cDate}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.cDate && (
            <span className="text-red-500 text-sm">{errors.cDate}</span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="loanAmount">Loan Amount</label>
          <input
            type="text"
            id="loanAmount"
            className="border flex-grow outline-none rounded border-gray-500 py-2 px-3"
            value={formData.loanAmount}
            onChange={handleChange}
            disabled={showForm}
          />
          {errors.loanAmount && (
            <span className="text-red-500 text-sm">{errors.loanAmount}</span>
          )}
        </div>
        <div className="w-full flex justify-end items-end col-span-2">
          <button
            className="w-1/4 bg-blue-500 text-white rounded-md py-3 font-semibold disabled:bg-gray-400"
            disabled={showForm}
          >
            Update
          </button>
        </div>
      </form>

      {showForm && (
        <div className="w-full h-full flex flex-col items-center py-10 gap-10 font-bengali">
          <div className="w-[210mm] flex justify-end items-center font-roboto">
            <button
              className="px-8 py-2 bg-blue-500 text-white text-xl flex items-center gap-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => generatePDF()}
            >
              Print <IoPrintSharp className="text-2xl" />
            </button>
          </div>

          <div className="w-[210mm]" ref={printRef}>
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
                        <span className="text-nowrap absolute left-32">
                          {headerInfoData.name}
                        </span>
                        <br />
                      </span>
                      .......................................................................{" "}
                      <span className="relative">
                        পিতা / স্বামী
                        .........................................................................
                        <span className="text-nowrap absolute left-28">
                          {headerInfoData.gurdianName}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        গ্রাম - .........................
                        <span className="text-nowrap absolute left-10">
                          {headerInfoData.cVillage}
                        </span>
                      </span>
                      ,
                      <span className="relative">
                        পোঃ - .........................
                        <span className="text-nowrap absolute left-10">
                          {headerInfoData.cPost}
                        </span>
                      </span>
                      ,
                      <span className="relative">
                        ব্লক - .........................
                        <span className="text-nowrap absolute left-10">
                          {headerInfoData.cBlock}
                        </span>
                      </span>
                      ,
                      <span className="relative">
                        জিলা - .........................
                        <span className="text-nowrap absolute left-12">
                          {headerInfoData.cDistrict}
                        </span>
                      </span>{" "}
                      <span className="font-semibold">
                        {headerInfoData.samitiName}
                      </span>
                      -এর সভ্য এবং{" "}
                      <span className="relative">
                        ..................................
                        <span className="text-nowrap absolute left-4">
                          {headerInfoData.creditCardNo}
                        </span>
                      </span>{" "}
                      নং কৃষাণ ক্রেডিট কার্ডের অধিকারী। বিভিন্ন ফসলের জন্য আমি
                      সমিতির থেকে সর্বাধিক{" "}
                      <span className="relative">
                        ..................................................
                        <span className="text-nowrap absolute left-4">
                          {headerInfoData.creditLimitAmount}
                        </span>
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
                          <span className="text-nowrap absolute left-16">
                            {headerInfoData.creditCardNo}
                          </span>
                        </span>
                      </div>
                      <div>
                        <p className="mb-2 relative">
                          তারিখ .............................{" "}
                          <span className="text-nowrap absolute left-24">
                            {format(headerInfoData.cDate, "dd-MM-yyyy")}
                          </span>
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
                      <span className="absolute left-[270px] font-normal">
                        {headerInfoData.cropName}
                      </span>
                      <span className="absolute right-[270px] font-normal">
                        {headerInfoData.cropLimitAmount}
                      </span>
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
                      <p className="relative">
                        C.L. ....................{" "}
                        <span className="absolute left-12">
                          {headerInfoData.creditLimitNo}
                        </span>
                      </p>
                    </div>

                    <p className="w-full mb-2">
                      <span className="text-lg font-semibold">
                        {headerInfoData.samitiName}
                      </span>{" "}
                      <span className="relative">
                        আমি শ্রী / শ্রীমতি
                        .............................................
                        <span className="text-nowrap absolute left-32">
                          {headerInfoData.name}
                        </span>
                      </span>{" "}
                      ...........................................................................{" "}
                      <span className="relative">
                        পিতা / স্বামী
                        .....................................................................
                        <span className="text-nowrap absolute left-24">
                          {headerInfoData.gurdianName}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        ক্রেডিট কার্ড হোল্ডিং নং
                        ............................................
                        <span className="text-nowrap absolute left-40">
                          {headerInfoData.creditCardNo}
                        </span>
                      </span>{" "}
                      আমি{" "}
                      <span className="font-semibold">
                        {headerInfoData.samitiName}
                      </span>
                      -এর নিকট হইতে
                      <span className="relative">
                        ....................................................................
                        <span className="text-nowrap absolute left-8">
                          {headerInfoData.creditCardNo}
                        </span>
                      </span>
                      নং কৃষাণ ক্রেডিট কার্ডের নির্ধারিত কর্জ সীমার মধ্য হইতে{" "}
                      <span className="relative">
                        ..................................
                        <span className="text-nowrap absolute left-5">
                          {headerInfoData.cropName}
                        </span>
                      </span>{" "}
                      চাষের জন্য{" "}
                      <span className="relative">
                        ..............................
                        <span className="text-nowrap absolute left-5">
                          {headerInfoData.loanAmount}
                        </span>
                      </span>{" "}
                      টাকা{" "}
                      <span className="relative">
                        (
                        ..........................................................
                        <span className="absolute left-6 bottom-6 text-nowrap">
                          {headerInfoData.loanAmount &&
                            convertToWords(
                              parseFloat(headerInfoData.loanAmount)
                            )}{" "}
                          Only
                        </span>
                        ........................................... ) নগদে
                        বুঝিয়া পাইলাম।
                      </span>
                    </p>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="relative">
                        টাকা ...............................................
                        <span className="absolute left-12">
                          {headerInfoData.loanAmount}
                        </span>
                      </p>
                      <p className="relative">
                        তারিখ .............................................
                        <span className="absolute left-12">
                          {format(headerInfoData.cDate, "dd-MM-yyyy")}
                        </span>
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
                        <span className="absolute left-32">
                          {headerInfoData.creditCardNo}
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
                      <span className="absolute left-12">
                        {headerInfoData.loanAmount}
                      </span>
                    </span>{" "}
                    <span className="relative">
                      কথায়
                      ............................................................................
                      <span className="absolute left-16 text-nowrap">
                        {headerInfoData.loanAmount &&
                          convertToWords(
                            parseFloat(headerInfoData.loanAmount)
                          )}{" "}
                        Only
                      </span>
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
    </div>
  );
};

export default TamshukForm;
