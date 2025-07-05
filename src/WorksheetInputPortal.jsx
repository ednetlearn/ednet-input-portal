import React, { useState } from 'react';

export default function WorksheetInputPortal() {
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
          previewText: event.target.result.slice(0, 1000) // basic preview
        }));
      };
      if (uploadedFile) reader.readAsText(uploadedFile);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    alert('Data submitted. Ready to connect to Airtable.');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">EdNet Worksheet Input Portal</h1>

      <div className="mb-4">
        <label className="mr-4">Select Input Mode:</label>
        {['text', 'dropdown', 'upload'].map((mode) => (
          <label key={mode}

