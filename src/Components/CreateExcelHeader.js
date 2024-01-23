import React from 'react';

const CreateExcelHeader = ({missingFields}) => {
  return (
    <div>
      <table style={{ width: "100%" }}>
        <tr>
          <th
            style={{
              padding: "5px",
              border: "2px solid #dddddd",
              textAlign: "center",
            }}
          >
            S.NO
          </th>
          <th
            style={{
              padding: "5px",
              border: "2px solid #dddddd",
              textAlign: "center",
            }}
          >
            Title
          </th>
        </tr>
        {missingFields.map((item, index) => (
          <tr key={index}>
            <td
              style={{
                padding: "5px",
                border: "2px solid #dddddd",
                textAlign: "center",
              }}
            >
              {index + 1}
            </td>
            <td
              style={{
                fontFamily: "sans-serif",
                padding: "5px",
                border: "2px solid #dddddd",
                textAlign: "center",
              }}
            >
              {item}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default CreateExcelHeader;
