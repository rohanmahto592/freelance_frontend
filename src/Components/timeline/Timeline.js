import React from 'react';
import './timeline.css'
import { AboutContent } from '../../Pages/About/AboutContent';
import aboutus from '../../Assets/Images/aboutus.png'
const Timeline = () => {
  return (
   
<div>
      <section className="page-section" id="about">
            <div className="container">
                <div className="text-center">
                    <h4 className="section-heading text-uppercase">About Glimpse</h4>
                </div>
                <div className='row'>
                    {
                        AboutContent.map((item)=>(
                            
                            <div className='col-sm-6'>
                                <div style={{minHeight:'270px',maxHeight:'270px',overflow:'auto',scrollbarWidth:'none',scrollBehavior:'smooth'}} className='col-sm-12 shadow-sm p-3 mb-5 bg-body rounded'>
                                    <div style={{height:'40px',width:'40px',margin:'auto'}}>
                                        <img style={{width:'100%',height:"100%"}} src={aboutus} alt="knot"/>
                                    </div>
                                <h4 style={{color:'slateblue',textAlign:'center'}}>{item.title}</h4>
                                <hr/>
                                <p style={{textAlign:'justify',fontFamily:'sans-serif',letterSpacing:'1px'}}>{item.desc}</p>
                            </div>
                            </div>
                        ))
                    }

                 
                </div>
            </div>
        </section>
    </div>
  
  );
}

export default Timeline;
