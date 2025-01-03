import React, { useState } from 'react';

const ButtonWithSelectSwitch = ({ buttonTitle = "Default Title", fetchUrl="https://dummy.com", modelOptions = ['Gemini','llama'] }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    systemPrompt: "",
    maxTokens: 0,
    model: modelOptions[0] || "",
  });

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Save successful:", data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`flex items-center space-x-2 isSwitchOn ? "bg-black" : "bg-gray-400`}>
        <div className='flex space-x-2  p-1 border-black border-2 bg-slate-200 rounded-lg'>
       
        <button
          className={`btn btn-neutral btn-sm px-4 py-2 text-white ${isSwitchOn ? "bg-black" : "bg-gray-400 cursor-not-allowed"}`}
          disabled={!isSwitchOn}
          onClick={() => setIsModalOpen(true)}
        >
          {buttonTitle || "Click Me"}
        </button>
        <label className="flex items-center cursor-pointer">
          
          <input
            type="checkbox"
            className="toggle toggle-xs"
            checked={isSwitchOn}
            onChange={handleSwitchChange}
          />
        </label>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Form</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">System Prompt</label>
                <textarea
                  name="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Max Tokens</label>
                <input
                  type="number"
                  name="maxTokens"
                  value={formData.maxTokens}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Model</label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {modelOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonWithSelectSwitch;

