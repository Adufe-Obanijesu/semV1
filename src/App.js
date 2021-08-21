import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PaystackButton } from 'react-paystack';
import axios from 'axios';
import { ClipLoader } from "react-spinners";
import { Modal, ModalHeader, Container } from 'reactstrap'


// Importing CSS files
import "./App.css";

// Importing database
import db from './db.js';

toast.configure()
const App = () => {

  const successNotification = () => {
        toast.success("Transaction successful. Crediting your meter...", {position: toast.POSITION.BOTTOM_RIGHT});
    }

    const errorNotification = (message) => {
        toast.error(message, {position: toast.POSITION.BOTTOM_RIGHT});
    }

  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ amount, setAmount ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ name, setName ] = useState("");
  const [ meterNumber, setMeterNumber ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ modal, setModal ] = useState(false);
  const [ creditModal, setCreditModal ] = useState(false);
  const [ accessNumber, setAccessNumber ] = useState("");

  // Setting price per unit
  const pricePerUnit = 10;

  const initiatePayment = e => {
    console.log("it got here")
    e.preventDefault();

    if(name === "" || email === "" || meterNumber === "" || amount === "" || phoneNumber === "") {
      errorNotification("Error paying, please ensure that all the fields are filled");
      return 0;
    }

    const userDetails = db.find(user => {
      return user.meterNumber === meterNumber
    })

    if(userDetails === undefined) {
      errorNotification("Meter not recognized");
      return 0;
    }

    setUsername(userDetails.name);
    setAccessNumber(userDetails.accessNumber);
    setModal(true);

    
  }

  const sendMessage = () => {
    setCreditModal(true);
    const amountOfUnit = amount/pricePerUnit;
    axios.post("https://www.bulksmsnigeria.com/api/v1/sms/create", {
    "api_token": "pgMmXdOsvrwJTEl1YJHDOU5a26xvvnZuimRi4cAp8dXLY4YMp7m9mH3Tx2ah",
    "to": accessNumber,
    "from": "Pappijoe",
    "body": amountOfUnit,
    "dnd": "6"
}
  ).then(res => {
    console.log(res);
    setCreditModal(false);
    setModal(false);
    successNotification();
    console.log(amountOfUnit);
  })
  .catch(err=> {
    console.log(err)
    setCreditModal(false);
    setModal(false);
    errorNotification("Error crediting your meter. Please try again later.")
  })
  

  }

   // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
  }

  const componentProps = {
      reference: (new Date()).getTime(),
      email,
      amount: amount * 100,
      publicKey: 'pk_test_d9602281402b5d4684870021e5a9814190f03108',
        text: 'Pay',
        onSuccess: (reference) => sendMessage(reference),
        onClose: handlePaystackCloseAction,
    };

  return (
    <div id="signup">
      <section className="bg-white shadow">
        <h3 className="text-center mb-4">Smart Energy Meter</h3>
        <Modal isOpen={ modal } toggle={ () => setModal(!modal) } >
          <Container> 
            <ModalHeader toggle={ () => setModal(!modal) }>Delete</ModalHeader>
          
            <p><span>Name</span>: { username }</p>
            <p><span>Meter number</span>: { meterNumber }</p>
            <p><span>Email</span>: { email }</p>
            <p><span>Phone number</span>: { phoneNumber }</p>
            <p><span>Amount</span>: { amount }</p>
            <p><span>Number of units</span>: { amount/pricePerUnit }</p>
            <PaystackButton {...componentProps} className="btn btn-primary btn-block mb-2" />
          </Container>
        </Modal>

        <Modal isOpen={ creditModal } toggle={ () => setModal(!creditModal) } >
        <Container> 
          <ModalHeader toggle={ () => setCreditModal(!creditModal) }>Please wait while we credit your meter</ModalHeader>
        
          <div className="d-flex justify-content-center mb-2"><ClipLoader size="40" color="#000" loading={ true } /></div>
        </Container>
      </Modal>


        <form onSubmit={(e) => initiatePayment(e)}>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Name" value={name} onChange={ e => setName(e.target.value) } /> 
        </div>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Meter number" value={meterNumber} onChange={ e => setMeterNumber(e.target.value) } />
        </div>
        <div className="form-group">
          <input className="form-control" type="email" placeholder="Email" value={email} onChange={ e => setEmail(e.target.value) } /> 
        </div>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Phone number" value={phoneNumber} onChange={ e => setPhoneNumber(e.target.value) } /> 
        </div>
        <div className="form-group">
          <input className="form-control" type="text" placeholder="Amount" value={amount} onChange={ e => setAmount(e.target.value) } /> 
        </div>
          <button className="btn btn-primary btn-block" type="submit">Submit</button>
        </form>
      </section>
    </div>
  )
}

export default App;