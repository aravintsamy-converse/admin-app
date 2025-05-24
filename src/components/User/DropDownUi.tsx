
"use client";

import { useState, useEffect, } from "react";
import { fetchDropDownData } from "@/Services/Pages/User/TableServices"


const DropDownUi = () => {
  const [options, setOptions] = useState([]);
  console.log("🚀 ~ DropDownUi ~ options:", options)

  const fetchOptions =
    async (searchQuery: string, pageNum: number, append = false) => {
      try {
        const params: any = {
          search: searchQuery,
          page: pageNum,
          record_limit: 10,
        }
        const queryString = new URLSearchParams(params).toString()
        const response = await fetchDropDownData(queryString)
        setOptions(response.options.map((item: { value: string; label: string }) => ({
          value: item.value,
          label: item.label,
        })))
      } catch (err) {
        console.error("Dropdown fetch error:", err)
      }
    }
  // Initial fetch and search updates
  useEffect(() => {
    fetchOptions("", 1, false)
  }, []);



  return (
    <div>
      <div>
        {options.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </div>
    </div>
  );
};

export default DropDownUi;
