"use client";
import React, { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonField = {
  path: string;
  value: JsonValue;
};

export default function PageJson() {
  const [fields, setFields] = useState<JsonField[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          const extractedFields = extractFields(json);
          setFields(extractedFields);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  // ฟังก์ชันสำหรับแปลง JSON เป็น fields
  const extractFields = (
    obj: JsonValue,
    parentPath: string = ""
  ): JsonField[] => {
    let result: JsonField[] = [];

    if (Array.isArray(obj)) {
      // จัดการกับ Array
      obj.forEach((item, index) => {
        const currentPath = parentPath
          ? `${parentPath}[${index}]`
          : `[${index}]`;
        if (typeof item === "object" && item !== null) {
          result = [...result, ...extractFields(item, currentPath)];
        } else {
          result.push({
            path: currentPath,
            value: item,
          });
        }
      });
    } else if (typeof obj === "object" && obj !== null) {
      // จัดการกับ Object
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        if (typeof value === "object" && value !== null) {
          result = [...result, ...extractFields(value, currentPath)];
        } else {
          result.push({
            path: currentPath,
            value: value,
          });
        }
      });
    }

    return result;
  };

  // ฟังก์ชันสำหรับอัพเดทค่าใน field
  const handleFieldChange = (path: string, newValue: string) => {
    setFields(
      fields.map((field) => {
        if (field.path === path) {
          try {
            // พยายามแปลงค่าเป็น JSON ถ้าเป็นไปได้
            const parsedValue = JSON.parse(newValue);
            return { ...field, value: parsedValue };
          } catch {
            // ถ้าแปลงไม่ได้ ใช้ค่าเดิม
            return { ...field, value: newValue };
          }
        }
        return field;
      })
    );
  };

  // ฟังก์ชันสำหรับแปลง fields กลับเป็น JSON
  const saveChanges = () => {
    try {
      const result = fields.reduce((acc, field) => {
        // แยก path ด้วย . แต่ต้องระวังกรณี array indices
        const paths = field.path.split(/\.|\[|\]/).filter((p) => p !== "");
        let current: Record<string, any> = acc;

        paths.forEach((path, index) => {
          if (index === paths.length - 1) {
            let value = field.value;
            if (!isNaN(Number(value))) {
              value = Number(value);
            } else if (value === "true" || value === "false") {
              value = value === "true";
            }

            // ถ้าเป็น array index
            if (!isNaN(Number(path))) {
              if (!Array.isArray(current)) {
                current = [];
              }
              current[Number(path)] = value;
            } else {
              current[path] = value;
            }
          } else {
            // ถ้าเป็น array index
            if (!isNaN(Number(path))) {
              if (!Array.isArray(current)) {
                current = [];
              }
              current[Number(path)] =
                current[Number(path)] ||
                (!isNaN(Number(paths[index + 1])) ? [] : {});
              current = current[Number(path)];
            } else {
              current[path] =
                current[path] || (!isNaN(Number(paths[index + 1])) ? [] : {});
              current = current[path];
            }
          }
        });

        return acc;
      }, {} as Record<string, any>);

      const jsonString = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error saving changes");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <Link href="/json-textedit" className="btn btn-primary">
          JSON Text Editor
        </Link>
      </div>
      <h1 className="text-2xl mb-4">JSON Editor</h1>

      <div className="mb-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="border p-2"
        />
      </div>

      {fields.length > 0 && (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-xl font-medium text-red-500">
                {field.path}
              </label>
              <textarea
                value={
                  Array.isArray(field.value) || typeof field.value === "object"
                    ? JSON.stringify(field.value)
                    : String(field.value)
                }
                disabled={
                  field.path.includes("id") ||
                  field.path.includes("class") ||
                  field.path.includes("align") ||
                  field.path.includes(".components[0].component")
                }
                onChange={(e) => handleFieldChange(field.path, e.target.value)}
                className={clsx(
                  "mt-1 p-2 border rounded-md w-full",
                  field.path.includes("id") && "bg-gray-300",
                  field.path.includes("class") && "bg-gray-300",
                  field.path.includes("align") && "bg-gray-300",
                  field.path.includes(".components[0].component") &&
                    "bg-gray-300",
                  field.path.includes(".content") && "min-h-[150px]",
                  field.path.endsWith(".c") && "min-h-[150px]"
                )}
              />
            </div>
          ))}
          <button
            onClick={saveChanges}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            บันทึกและดาวน์โหลด JSON
          </button>
        </div>
      )}
    </div>
  );
}
