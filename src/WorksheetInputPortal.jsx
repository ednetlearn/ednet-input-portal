const handleSubmit = async (e) => {
  e.preventDefault();

  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

  const record = {
    fields: {
      "Topic / Keyword": formData.topic,
      "Text Prompt Input": formData.textPrompt,
      "Input Type": inputMode,
      "Grade": formData.grade,
      "Subject": formData.subject,
      "Content Type": formData.contentType,
    }
  };

  try {
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    if (res.ok) {
      alert('Data successfully added to Airtable!');
      setFormData({
        topic: '',
        grade: '',
        subject: '',
        contentType: '',
        textPrompt: '',
        file: null,
        previewText: '',
      });
    } else {
      console.error(await res.text());
      alert('Submission failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Error connecting to Airtable.');
  }
};
