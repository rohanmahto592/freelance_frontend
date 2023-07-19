import group1 from './Assets/Images/group1.png'
import group2 from './Assets/Images/group2.png'
import group3 from './Assets/Images/group3.png'
import group4 from './Assets/Images/group4.png'
import group5 from './Assets/Images/group5.png'
import group6 from './Assets/Images/group6.png'
import group7 from './Assets/Images/group7.png'
export const userTypes = ["SELF", "GENERIC", "UNIVERSITY"];

export const serviceInfo=[
    {
        img:group1,
        title:'Tailored Solutions',
        description:"We offer personalized services to cater to your unique requirements, providing you with the edge you need in today's competitive landscape."
    },
    {
        img:group2,
        title:'Timely Delivery',
        description:"Our dedicated team understands the importance of delivering high-quality products within strict timelines and budgets."
    },
    {
        img:group3,
        title:'Trusted Services',
        description:"We have earned a solid reputation for our meticulous attention to detail and commitment to providing a seamless experience."
    },
    {
        img:group4,
        title:'Global Scale Services',
        description:"Our strong partnerships with globally renowned organizations reflect our commitment to delivering exceptional services worldwide."
    }
    
]
export const servicesProvider=[
    {
        img:group5,
        title:'Direct Print Mails',
        description:"Delivering communication solutions, ensuring your messages reach the intended recipients seamlessly and with maximum impact."
    },
    {
        img:group6,
        title:'Merchandise For Fairs',
        description:"Creating customized merchandise that embodies your brand identity, captivates your target audience, and leaves a lasting impression."
    },
    {
        img:group7,
        title:'Welcome kit Programs',
        description:"Managing exceptional welcome kits that foster a sense of belonging and appreciation among new members."
    },
    
]
export const redirection = {
    ADMIN:"/admin/dashboard",
    SELF:"/user/uploadfile",
    UNIVERSITY:"/user/uploadfile",
    DELIVERY:"/delivery/uploadfile",
    GENERIC:"/user/uploadfile"
}