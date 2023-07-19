import React,{useState} from 'react';

const TableEditor = () => {
    const [rowData, setRowData] = useState({ name: '', email: '', phone: '' });

  function editRow(event) {
    const row = event.target.closest('tr');
    const name = row.cells[0].textContent;
    const email = row.cells[1].textContent;
    const phone = row.cells[2].textContent;

    setRowData({ name, email, phone });
    
  }

  return (
    <div>
            <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td contentEditable="true">John Doe</td>
          <td>john.doe@example.com</td>
          <td>555-555-5555</td>
          <td>
            <button className="btn btn-primary" onClick={editRow}>Edit</button>
          </td>
        </tr>
        <tr>
          <td>Jane Doe</td>
          <td>jane.doe@example.com</td>
          <td>555-555-5555</td>
          <td>
            <button className="btn btn-primary" onClick={editRow}>Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

      
    </div>
  );
}

export default TableEditor;
