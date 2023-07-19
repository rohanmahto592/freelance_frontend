import React from 'react';

const Pagination = (props) => {
    const {pageNumber,handleNext,handlePrev}=props;
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',padding:'5px 0px'}}>
            <nav aria-label="Page navigation example">
             <ul class="pagination">
    <li class=" rounded page-link" onClick={handlePrev}>Previous</li>
    <li class=" rounded page-link" style={{margin:'0px 4px'}}>{pageNumber}</li>
    <li class=" rounded page-link" onClick={handleNext}>Next</li>
    </ul>
    </nav>
    </div>
  );
}

export default Pagination;
