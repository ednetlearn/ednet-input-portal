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
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          file,
          previewText: event.target.result.slice(0, 1000)
        }));
      };
      if (file) reader.readAsText(file);
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
            Name: formData.topic,
            Level: formData.grade,
            Subject: formData.subject,
            Type: formData.contentType,
            Description: formData.textPrompt,
            Status: 'Draft'
          }
        }
      ]);
      alert('✅ Worksheet submitted to Airtable!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit. Check console.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">EdNet Worksheet Input Portal</h1>

      <div className="mb-4">
        <label className="mr-4">Select Input Mode:</label>
        {['text', 'dropdown', 'upload'].map((mode) => (
          <label key={mode} className="mr-4">
            <input
              type="radio"
              name="inputMode"
              value={mode}
              checked={inputMode === mode}
              onChange={() => setInputMode(mode)}
              className="mr-1"
            />
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </label>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="topic"
          placeholder="Topic / Keyword"
          value={formData.topic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {(inputMode === 'dropdown' || inputMode === 'text') && (
          <>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Grade</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={`Grade ${i + 1}`}>{`Grade ${i + 1}`}</option>
              ))}
            </select>

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Subject</option>
              {['English', 'Math', 'Science', 'Telugu', 'Hindi'].map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>

            <select
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Content Type</option>
              {['Worksheet', 'Quiz', 'Test', 'Revision Notes'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </>
        )}

        {inputMode === 'text' && (
          <textarea
            name="textPrompt"
            value={formData.textPrompt}
            onChange={handleChange}
            placeholder="Enter topic details, concepts, or summary..."
            className="w-full p-2 border rounded"
            rows={4}
          />
        )}

        {inputMode === 'upload' && (
          <>
            <input
              type="file"
              name="file"
              accept=".txt,.pdf"
              onChange={handleChange}
              className="w-full"
            />
            {formData.previewText && (
              <div className="bg-gray-100 border p-2 mt-2 rounded">
                <p className="text-sm whitespace-pre-wrap">{formData.previewText}</p>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default WorksheetInputPortal;
