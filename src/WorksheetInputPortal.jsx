import React, { useState } from 'react';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_API_KEY }).base(
  import.meta.env.VITE_AIRTABLE_BASE_ID
);

function WorksheetInputPortal() {
  const [inputMode, setInputMode] = useState('text');
  const [formData, setFormData] = useState({
    topic: '',
    grade: '',
    subject: '',
    contentType: '',
    textPrompt: '',
    file: null,
    previewText: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const reader = new FileReader();
      const uploadedFile = files[0];
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          file: uploadedFile,
          previewText: event.target.result.slice(0, 1000)
        }));
      };
      if (uploadedFile) reader.readAsText(uploadedFile);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await base(import.meta.env.VITE_AIRTABLE_TABLE_NAME).create([
        {
          fields: {
            Name: formData.
