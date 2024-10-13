import React, { useState } from 'react';

const DynamicForm = ({ formData,handleInputChange,method="POST" ,handleSubmit=""  }) => {
    // ensure we have a non-empty object.
    //console.info("DynamicForm : formData len ", Object.keys(formData).length, formData.constructor === Object,formData)
    if (Object.keys(formData).length === 0 ) {
        //console.error("DynamicForm : Empty Template")
        return <div className='text-3xl text-red-600'>Template missing!</div>;
    }
  
  const handleSubmitDefault = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formValues);
    // Handle form submission logic here
  };

  

  return (
    <form  className="space-y-4" method={method} onSubmit={handleSubmit?handleSubmit:handleSubmitDefault}>
      {Object.entries(formData).map(([key, type]) => (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            type={type}
            name={key}
            id={key}
            onChange={handleInputChange}
            value={formValues[key] || ''}
            className="className='input input-bordered input-primary input-sm w-full max-w-xs'"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
