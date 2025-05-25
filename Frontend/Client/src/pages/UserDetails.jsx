import { useState, useEffect } from "react";
import axios from "axios";

const UserDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userDetails, setUserDetails] = useState(null);
  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.userName) return;
    axios
      .get(`http://localhost:8000/users/${user.userName}`)
      .then((res) => setUserDetails(res.data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [user]);

  const handleViewCode = (index) => {
    const problem = userDetails?.problemsSolved?.[index];
    if (problem) {
      setCode(problem.code);
      setIsModalOpen(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCode("");
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg font-medium">
        No user logged in.
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg font-medium">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <h2 className="text-3xl font-extrabold text-gray-900 border-b-4 border-indigo-600 pb-3">
        User Details
      </h2>

      <div className="bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Username:</span>{" "}
            {userDetails.userName}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">First Name:</span>{" "}
            {userDetails.firstName}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Last Name:</span>{" "}
            {userDetails.lastName}
          </p>
        </div>
        <div>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Email:</span>{" "}
            {userDetails.email}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">College:</span>{" "}
            {userDetails.collegeName}
          </p>
          <p className="mb-3">
            <span className="font-semibold text-indigo-600">Problems Contributed:</span>{" "}
            {userDetails.problemsContributed || 0}
          </p>
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          Problems Solved
        </h3>

        {userDetails.problemsSolved?.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200 text-gray-800">
              <thead className="bg-indigo-50 text-indigo-700 uppercase text-sm font-semibold tracking-wide">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 text-left">Problem Name</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">Difficulty</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">Language</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-center">Code</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.problemsSolved.map((problem, index) => (
                  <tr
                    key={index}
                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3 border-b border-gray-200">{problem.problemName}</td>
                    <td className="px-6 py-3 border-b border-gray-200 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 text-center">{problem.language}</td>
                    <td className="px-6 py-3 border-b border-gray-200 text-center">
                      <button
                        onClick={() => handleViewCode(index)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No problems solved yet.</p>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[80vh] flex flex-col">
            <h4
              id="modal-title"
              className="text-xl font-bold text-gray-900 mb-4 border-b pb-2"
            >
              Submitted Code
            </h4>
            <pre className="flex-1 overflow-auto whitespace-pre-wrap bg-gray-100 p-5 rounded-lg font-mono text-sm text-gray-800">
              {code}
            </pre>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCopyCode}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Copy Code
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
