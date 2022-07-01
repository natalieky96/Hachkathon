import './App.css';
import * as PropTypes from "prop-types";
import {useState} from "react";
import {ParkManager} from "./ParkManager"
import WebMap from "./WebMap"

const pm = new ParkManager();


function Button(props) {
    const {renter, onClick} = props;
    if (renter === 'to') {
        return (
            <button id={"button"} onClick={onClick}>
                <div id={"inner"}>
                    יש לי חניה להשכיר
                </div>
            </button>
        )
    } else if (renter === 'from') {
        return (
            <button id={"button"} onClick={onClick}>
                <div id={"inner"}>
                    אני רוצה למצוא חניה
                </div>
            </button>

        )
    }

}

Button.propTypes = {
    variant: PropTypes.string,
    children: PropTypes.node
};

const page_css_classes_dict = {
    'hidden': 'form hidden',
    'toRentTo': 'form renting-to',
    'toRentFrom': 'form renting-from'
}

function submitFormTo(event) {
    event.preventDefault();
    console.log(event.target[0].value);
    return null;
}

function submitFormFrom(event) {
    event.preventDefault();
    return null;
}

function Form(props) {
    if (props.className==="form renting-to") {
        return (
            <form className="form renting-to" onSubmit={submitFormTo}>
                <div className="firstQuestionTo">
                    <div>
                        <label className="label">:כתובת</label>
                    </div>
                    <div>
                        <input name="userAddress"/>
                    </div>
                </div>
                <div className="secondQuestionTo">
                    <div>
                        <label className="label">:מחיר לשעה</label>
                    </div>
                    <div>
                        <input name="pricePerHour"/>
                    </div>
                </div>
                <div>
                    <button className="special_button" type="submit">Submit</button>
                </div>
            </form>
        )
    } else if(props.className === "form renting-from"){
        return (
            <form className="form renting-from" onSubmit={submitFormFrom}>
                <div className="firstQuestionTo">
                    <div>
                        <label className="label">:תאריך</label>
                    </div>
                    <div>
                        <input name="userAddress"/>
                    </div>
                </div>
                <div className="secondQuestionTo">
                    <div>
                        <label className="label">:שעה</label>
                    </div>
                    <div>
                        <input name="pricePerHour"/>
                    </div>
                </div>
                <div>
                    <button className="special_button" type="submit">Submit</button>
                </div>
            </form>
        )
    } else if(props.className === "map"){
        <WebMap />
    } else{
        return (
            <form className="hidden form">

            </form>
        );
    }


}

function App() {

    const [showDiv, setShowDiv] = useState('hidden form');

    return (
        <div className="App">

            <div>
                <img className='logo' src={require("./imgs/logo_the_newest.png")}/>
            </div>
            <Button className="button grow" renter={'to'} onClick={()=>{setShowDiv("form renting-to")}}/>
            <Button className="button grow" renter={'from'} onClick={()=>{setShowDiv("form renting-from")}}/>
            <Form className={showDiv}>

            </Form>
        </div>

    );
}

export default App;
