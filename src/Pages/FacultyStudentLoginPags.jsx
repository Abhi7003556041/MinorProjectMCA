import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { facultyLogin } from '../redux/action/facultyAction'
import { studentLogin } from '../redux/action/studentAction'
import classnames from 'classnames'

import '../Style/facultyStudentLogin.css'
import '../Style/footer.css'

import { adminLogin } from '../redux/action/adminAction'
import Nav from '../Components/Nav'




const FacultyStudentLoginPags = () => {
    const store = useSelector((state) => state)
    const dispatch = useDispatch()
    const [facultyRegNum, setFacultyRegNum] = useState('')
    const [facultyPassword, setFacultyPassword] = useState('')
    const [studentRegNum, setStudentRegNum] = useState('')
    const [studentPassword, setStudentPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [errorsHelper, setErrorsHelper] = useState({})
    const [isFacultyLoading, setIsFacultyLoading] = useState(false)
    const [isStudentLoading, setIsStudentLoading] = useState(false)
    const [registrationNumber, setRegistrationNumber] = useState('')
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [password, setPassword] = useState('')

    const history = useHistory()
  

    useEffect(() => {
        if (store.faculty.isAuthenticated) {
            history.push('/faculty')
        }
    }, [store.faculty.isAuthenticated])

    useEffect(() => {
        if (store.error) {
            setErrors(store.error)
        }
    }, [store.error])
    useEffect(() => {
        if (store.student.isAuthenticated) {
            history.push('/home')
        }
    }, [store.student.isAuthenticated])

    useEffect(() => {
        if (store.errorHelper) {
            setErrorsHelper(store.errorHelper)
        }
    }, [store.errorHelper])






    const facultyFormHandler = (e) => {
        e.preventDefault()
        let registrationNumber;
        let password;
        setIsFacultyLoading(true)
        dispatch(facultyLogin({ registrationNumber: facultyRegNum, password: facultyPassword }))
    }

    useEffect(() => {
        if (store.error || store.faculty.isAuthenticated) {
            setIsFacultyLoading(false)
        }
        else {
            setIsFacultyLoading(true)
        }
    }, [store.error, store.faculty.isAuthenticated])

    const studentFormHandler = (e) => {
        e.preventDefault()
       
        setIsStudentLoading(true)
        dispatch(studentLogin({ registrationNumber: studentRegNum, password: studentPassword }))
    }

    useEffect(() => {
        if (store.errorHelper ||
            store.student.isAuthenticated) {
            setIsStudentLoading(false)
        }
        else {
            setIsStudentLoading(false)
        }

    }, [store.errorHelper, store.student.isAuthenticated])

    useEffect(() => {
        if (store.admin.isAuthenticated) {
            history.push('/admin')
        }
    }, [store.admin.isAuthenticated])
    useEffect(() => {
        if (store.error) {
            setErrors(store.error)
            setIsStudentLoading(false)

        }
    }, [store.error])

    const fromHandler = (e) => {
        e.preventDefault()
        setIsLoading(true)
        dispatch(adminLogin({registrationNumber, password}))
       
    }

    useEffect(() => {
        if (store.error ||
            store.admin.isAuthenticated) {
            setIsLoading(false)
        }
        
        else {
            setIsLoading(true)
        }
    }, [store.error, store.admin.isAuthenticated])


    return (
        <div>
            {/* <Nav/> */}
        <div className="container-fluid">
            <div className="row" id="trail">
                <div className="col-md-6">
                <div className="row m-5" >
                <div className="col-md-8 m-auto border" style={{ backgroundColor: "white", borderRadius: "1.2rem", padding: "1rem 1rem 0rem 1rem" }}>
                    <div>
                        <h3 className="text-center ">ADMIN</h3>
                        <form noValidate onSubmit={fromHandler}>
                            <div className="form-group" style={{display:'flex', flexDirection:'column',justifyContent:'space-between',margin:'10px',}}>
                                <label htmlFor="facRegId">Registration Number</label>
                                <input onChange={(e) => setRegistrationNumber(e.target.value)} type="text" value={registrationNumber} 
                                className={classnames('form-control', {
                                    'is-invalid': errors.registrationNumber
                                })}
                                    id="facRegId" style={{width:'100%'}}/>
                                {errors.registrationNumber && (
                                    <div className="invalid-feedback">{errors.registrationNumber}</div>
                                )}
                            </div>
                            <div className="form-group" style={{display:'flex', flexDirection:'column',justifyContent:'space-between',margin:'10px',}}>
                                <label htmlFor="passwordFacId">Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} 
                                  className={classnames('form-control', {
                                    'is-invalid': errors.registrationNumber
                                })}
                                    type="password" id="passwordFacId" style={{width:'100%'}} />
                                {errors.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-md-1">
                                    {
                                        isLoading && <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            {!isLoading && <button type="submit" className="btn btn-info btn-block ">Log In</button>}
                         
                            {<button  className="btn btn-info btn-block" onClick={()=>history.push('/signup/admin')}>Sign Up</button>}

                        </form>
                        <p className="text-center mt-2 ">
                            {/* <Link className="text-center" to="/forgotPassword/faculty">Forgot Password</Link> */}
                            </p>
                    </div>
                </div>
            </div>
                </div>
                <div className="col-md-6">
                    <div className="row m-5">
                        <div className="col-md-8 m-auto border" style={{ backgroundColor: "white", borderRadius: "1.2rem", padding: "1rem 1rem 0rem 1rem" }}>
                            <div>
                                <h3 className="text-center ">FACULTY</h3>
                                <form noValidate onSubmit={facultyFormHandler}>
                                    <div className="form-group">
                                        <label htmlFor="facRegId">Registration Number</label>
                                        <input onChange={(e) => setFacultyRegNum(e.target.value)} type="text" value={facultyRegNum} className={classnames('form-control', {
                                            'is-invalid': errors.registrationNumber
                                        })}
                                            id="facRegId" />
                                        {errors.registrationNumber && (
                                            <div className="invalid-feedback">{errors.registrationNumber}</div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="passwordFacId">Password</label>
                                        <input onChange={(e) => setFacultyPassword(e.target.value)} value={facultyPassword} className={classnames("form-control", {
                                            'is-invalid': errors.password
                                        })}
                                            type="password" id="passwordFacId" />
                                        {errors.password && (
                                            <div className="invalid-feedback">{errors.password}</div>
                                        )}
                                    </div>
                                    <div class="row justify-content-center">
                                        <div class="col-md-1">
                                            {
                                                isFacultyLoading && <div class="spinner-border text-primary" role="status">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    {!isFacultyLoading && <button type="submit" className="btn btn-info btn-block">Login</button>}
                                    {<button  className="btn btn-info btn-block" onClick={()=>history.push('/signup/faculty')}>Sign Up</button>}
                                </form>
                                <p className="text-center mt-2 "><Link className="text-center" to="/forgotPassword/faculty">Forgot Password</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className="row m-5">
                        <div className="col-md-8 m-auto border" style={{ backgroundColor: "white", borderRadius: "1.2rem", padding: "1rem 1rem 0rem 1rem" }}>
                            <div>
                                <h3 className="text-center">STUDENT</h3>
                                <form noValidate onSubmit={studentFormHandler}>
                                    <div className="form-group">
                                        <label htmlFor="studentId">Registration Number</label>
                                        <input onChange={(e) => setStudentRegNum(e.target.value)} type="text" value={studentRegNum} className={classnames('form-control', {
                                            'is-invalid': errorsHelper.registrationNumber
                                        })}
                                            id="studentId" />
                                        {errorsHelper.registrationNumber && (
                                            <div className="invalid-feedback">{errorsHelper.registrationNumber}</div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="passwordId">Password</label>
                                        <input onChange={(e) => setStudentPassword(e.target.value)} value={studentPassword} className={classnames("form-control", {
                                            'is-invalid': errorsHelper.password
                                        })}
                                            type="password" id="passwordId" />
                                        {errorsHelper.password && (
                                            <div className="invalid-feedback">{errorsHelper.password}</div>
                                        )}
                                    </div>
                                    <div class="row justify-content-center">
                                        <div class="col-md-1">
                                            {
                                                isStudentLoading && <div class="spinner-border text-primary" role="status">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {!isStudentLoading && <button type="submit" className="btn btn-info btn-block ">Login</button>}
                                    {<button  className="btn btn-info btn-block" onClick={()=>history.push('/signup/student')}>Sign Up</button>}
                                </form>
                                <p className="text-center"><Link className="text-center" to="/forgotPassword/student">Forgot Password</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
{/* <div >

  <footer className="text-white text-center text-lg-start bg-dark">
   
    <div className="container p-4">
     
      <div className="row mt-4">
       
        <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4">About company</h5>

          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti.
          </p>

          <p>
            Blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas
            molestias.
          </p>

          <div className="mt-4">
           
            <a type="button" className="btn btn-floating btn-light btn-lg"><i className="fab fa-facebook-f"></i></a>
           
            <a type="button" className="btn btn-floating btn-light btn-lg"><i className="fab fa-dribbble"></i></a>
           
            <a type="button" className="btn btn-floating btn-light btn-lg"><i className="fab fa-twitter"></i></a>
            
            <a type="button" className="btn btn-floating btn-light btn-lg"><i className="fab fa-google-plus-g"></i></a>
           
          </div>
        </div>
   

    
        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4 pb-1">Search something</h5>

          <div className="form-outline form-white mb-4">
            <input type="text" id="formControlLg" className="form-control form-control-lg" />
            <label className="form-label" for="formControlLg">Search</label>
          </div>

          <ul className="fa-ul" style={{marginleft: '1.65em'}}>
            <li className="mb-3">
              <span className="fa-li"><i className="fas fa-home"></i></span><span className="ms-2">Warsaw, 00-967, Poland</span>
            </li>
            <li className="mb-3">
              <span className="fa-li"><i className="fas fa-envelope"></i></span><span className="ms-2">contact@example.com</span>
            </li>
            <li className="mb-3">
              <span className="fa-li"><i className="fas fa-phone"></i></span><span className="ms-2">+ 48 234 567 88</span>
            </li>
          </ul>
        </div>
       

       
        <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4">Opening hours</h5>

          <table className="table text-center text-white">
            <tbody className="fw-normal">
              <tr>
                <td>Mon - Thu:</td>
                <td>8am - 9pm</td>
              </tr>
              <tr>
                <td>Fri - Sat:</td>
                <td>8am - 1am</td>
              </tr>
              <tr>
                <td>Sunday:</td>
                <td>9am - 10pm</td>
              </tr>
            </tbody>
          </table>
        </div>
      
      </div>
     
    </div>
  

  
    <div className="text-center p-3" style={{backgroundcolor: 'rgba(0, 0, 0, 0.2)'}}>
      © 2020 Copyright:
      <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
    </div>
    
  </footer>

</div> */}
<footer className="footer-distributed">

<div className="footer-left">

    <h3>Company<span>logo</span></h3>

    <p className="footer-links">
        <a href="#" className="link-1">Home</a>
        
        <a href="#">Blog</a>
    
        <a href="#">Pricing</a>
    
        <a href="#">About</a>
        
        <a href="#">Faq</a>
        
        <a href="#">Contact</a>
    </p>

    <p className="footer-company-name">Company Name © 2015</p>
</div>

<div className="footer-center">

    <div>
        <i className="fa fa-map-marker"></i>
        <p><span>444 S. Cedros Ave</span> Solana Beach, California</p>
    </div>

    <div>
        <i className="fa fa-phone"></i>
        <p>+1.555.555.5555</p>
    </div>

    <div>
        <i className="fa fa-envelope"></i>
        <p><a href="mailto:support@company.com">support@company.com</a></p>
    </div>

</div>

<div className="footer-right">

    <p className="footer-company-about">
        <span>About the company</span>
        Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.
    </p>

    <div className="footer-icons">

        <a href="#"><i className="fa fa-facebook"></i></a>
        <a href="#"><i className="fa fa-twitter"></i></a>
        <a href="#"><i className="fa fa-linkedin"></i></a>
        <a href="#"><i className="fa fa-github"></i></a>

    </div>

</div>

</footer>
        </div>
    )
}

export default FacultyStudentLoginPags
