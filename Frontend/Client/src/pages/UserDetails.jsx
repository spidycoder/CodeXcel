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
    return <div className="p-4">No user logged in.</div>;
  }

  if (!userDetails) {
    return <div className="p-4">Loading user details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">User Details</h2>
      <div className="bg-white shadow p-4 rounded space-y-2">
        <p>
          <strong>Username:</strong> {userDetails.userName}
        </p>
        <p>
          <strong>First Name:</strong> {userDetails.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {userDetails.lastName}
        </p>
        <p>
          <strong>Email:</strong> {userDetails.email}
        </p>
        <p>
          <strong>College:</strong> {userDetails.collegeName}
        </p>
        <p>
          <strong>Problems Contributed:</strong>{" "}
          {userDetails.problemsContributed || 0}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Problems Solved</h3>
        {userDetails.problemsSolved?.length > 0 ? (
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-300">
              <tr>
                <th className="border px-4 py-2">Problem Name</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Language</th>
                <th className="border px-4 py-2">Code</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.problemsSolved.map((problem, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{problem.problemName}</td>
                  <td className="border px-4 py-2">{problem.difficulty}</td>
                  <td className="border px-4 py-2">{problem.language}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleViewCode(index)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No problems solved yet.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl space-y-4 relative">
            <h4 className="text-lg font-semibold">Submitted Code</h4>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded overflow-x-auto max-h-[400px]">
              {code}
            </pre>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCopyCode}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Copy Code
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
