import React from 'react'
import { Link } from 'react-router-dom';

 const  Nav = () => {

 

  return (
    <div className='nav-ul'>
      <img
        alt='logo'
        className='logo-image'
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnQyqoHMTLURYOwSwJtd4o2wD5yMY5OrdiTg&usqp=CAU"
      />
      <ul className='nav-ul nav-right'>
        <li><Link to='/signup'>SignUp</Link></li>
      </ul>
    </div>
  )
}

export default Nav;