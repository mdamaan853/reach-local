import React, {Component} from 'react';
import {Link} from 'react-dom';
import CircularLoader from '../circular-loader/circular-loader';

const initialState = {
    wb: null
 }

export default class SmsProBilling extends Component {
    constructor(){
        super();
        this.state = initialState;
    }
    componentDidMount(){
        this.calculateDetails();
    }
    
    calculateDetails(){
        let user = JSON.parse(localStorage.getItem("userInfo"));
        this.setState({
            wb: user.walletInfo.usableCredits
        })
    }

    render(){
        return(
            <div className="flex col-20">
                <div className="col-15 margin-left--auto margin-right--auto">
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Credit to be used</div>
                        <div className="text--bold text--darker">&#8377; {this.props.creditToBeUsed}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Available Credit</div>
                        <div className="text--bold text--darker">&#8377; {this.props.availableCredit}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Price Per Unit</div>
                        <div className="text--bold text--darker">&#8377; {this.props.pricePerUnit}</div>
                    </div>
                    {/* <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Campaign Charges</div>
                        <div className="text--bold text--darker">&#8377; {this.props.pricePerUnit.amount}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">GST (18&#37;)</div>
                        <div className="text--bold text--darker">&#8377; {(this.props.pricePerUnit.amount * this.props.pricePerUnit.taxMultiplier).toFixed(2)}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Payable Amount</div>
                        <div className="text--bold text--darker">&#8377; {this.props.pricePerUnit.totalAmount}</div>
                    </div>
                    <div className="col-20 flex pad flex-space--btw text-intent">
                        <div>Wallet Balance</div>
                        <div>&#8377; {this.state.wb}</div>
                    </div> */}
                    {
                        this.props.campSubmitErr &&
                        <div className="col-20 form-error margin-btm text--center">
                            <span>{this.props.campSubmitErr}</span>
                        </div>
                    }
                    <div className="col-20 flex flex-horz-center flex-wrap pad">
                    {
                        (this.props.availableCredit - this.props.creditToBeUsed >= 0) && !this.props.submitLoader &&
                        <React.Fragment>
                            <div className="col-4">
                                <button className="ui grey button" style={{width:'100%'}} onClick={()=>this.props.back()}> Back </button>
                            </div>
                            <div className="margin-left">
                                <button className="ui green button" style={{width:'100%'}} onClick={()=>this.props.submit(false)} disabled={!!this.props.campSubmitErr}> Submit Campaign </button>
                            </div>
                        </React.Fragment>
                    }
                    {
                        (this.props.availableCredit - this.props.creditToBeUsed < 0) && !this.props.submitLoader &&
                        <React.Fragment>
                            <div className="col-20 form-error margin-btm text--center">
                                <span>Your Subscription is short of &#8377; {(Math.abs(this.props.availableCredit - this.props.creditToBeUsed)).toFixed(2)} to Submit campaign.</span>
                            </div>
                            <div className="col-4">
                                <button className="ui grey button" style={{width:'100%'}} onClick={()=>this.props.back()}> Back </button>
                            </div>
                            <div className="margin-left">
                                <Link to="/service/package">
                                <button className="ui green button" style={{width:'100%'}} disabled={!!this.props.campSubmitErr}>Back to Purchase Package</button>
                                {/* <button className="ui green button" style={{width:'100%'}} onClick={()=>this.props.pay(Math.abs(this.state.wb - this.props.pricePerUnit.totalAmount))} disabled={!!this.props.campSubmitErr}> Pay &#8377; {(Math.abs(this.state.wb - this.props.pricePerUnit.totalAmount)).toFixed(2)} and Submit </button> */}
                                </Link>
                            </div>
                        </React.Fragment>
                    }
                    {
                        this.props.submitLoader &&
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    }
                    </div>
                </div>
            </div>
        );
    }

}