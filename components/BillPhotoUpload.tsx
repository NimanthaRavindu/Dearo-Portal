"use client";

import { useState, ChangeEvent } from "react";
import { Upload, X, FileImage } from "lucide-react";

export default function BillPhotoUploadPage() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      // පින්තූරය කියවා අවසන් වූ පසු ක්‍රියාත්මක වන කොටස
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);

        // 🎯 ප්‍රධාන Form එකේ ඇති Hidden Input එකට පින්තූරයේ දත්ත (Base64) සහ නම ඇතුළත් කිරීම
        const mainInput = document.getElementById("hidden-bill-photo-input") as HTMLInputElement;
        const mainNameInput = document.getElementById("hidden-bill-name-input") as HTMLInputElement;
        
        if (mainInput) mainInput.value = base64String;
        if (mainNameInput) mainNameInput.value = file.name;
      };

      // File එක Base64 දත්ත සමූහයක් ලෙස කියවීම
      reader.readAsDataURL(file);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    const input = document.getElementById("bill-image-input") as HTMLInputElement;
    if (input) input.value = "";

    // ප්‍රධාන Form එකේ සඟවා ඇති Input Fields ද හිස් කිරීම
    const mainInput = document.getElementById("hidden-bill-photo-input") as HTMLInputElement;
    const mainNameInput = document.getElementById("hidden-bill-name-input") as HTMLInputElement;
    if (mainInput) mainInput.value = "";
    if (mainNameInput) mainNameInput.value = "";
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className="flex flex-col items-center justify-center space-y-2">
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-24 cursor-pointer">
            <Upload className="text-slate-400 mb-1" size={24} />
            <span className="text-xs font-semibold text-slate-600">Click to upload document photo</span>
            <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or JPEG (Max 5MB)</span>
            <input
              id="bill-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              required
            />
          </label>
        ) : (
          <div className="relative w-full flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileImage size={12} className="text-blue-500" /> Bill_Selected.jpg
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">Ready to upload</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}