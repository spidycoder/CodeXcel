const AdminInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
      <img
        src="data:image/jpeg;base64,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"
        alt="Admin Profile"
        className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-800">Aditya Kumar</h2>
      <p className="text-sm text-gray-600">
        Username: <span className="font-medium">SpidyCoder</span>
      </p>
      <p className="text-sm text-gray-600">
        College:{" "}
        <span className="font-medium">
          Birla Institute of Technology, Mesra
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Email: <span className="font-medium">aditya767718@gmail.com</span>
      </p>
      <div className="mt-4 flex justify-center gap-4 text-blue-600 underline">
        <a
          href="https://www.linkedin.com/in/aditya-kumar-ba6784228/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://leetcode.com/u/spidycoder178/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LeetCode
        </a>
        <a
          href="https://codeforces.com/profile/SpidyCoder"
          target="_blank"
          rel="noopener noreferrer"
        >
          Codeforces
        </a>
      </div>
    </div>
  );
};

export default AdminInfo;
