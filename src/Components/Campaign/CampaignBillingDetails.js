import React, {Component} from 'react';
import CircularLoader from '../circular-loader/circular-loader';

const initialState = {
   cp: 0,
   prPrc: 0,
   tax: 0,
   pa: 0,
   wb: null
}

export default class CampaignBillingDetails extends Component {
    constructor(){
        super();
        this.state = initialState;
    }
    componentDidMount(){
        this.calculateDetails();
    }
    
    calculateDetails(){
        let cp = this.props.info.unitPrice * this.props.formControls.targetAudienceCount.value;
        let prPrc = 0;
        if(this.props.info.audienceBillingCreditType === 'basic'){
            prPrc = this.getPremiumSegPrice(); //*******************for basic, why are we considering premium and checked value************* */
        }
        let tax = (cp + prPrc)*this.props.info.taxMultiplier;
        let user = JSON.parse(localStorage.getItem("userInfo"));
        this.setState({
            cp: cp,
            prPrc: prPrc,
            tax: tax,
            pa: (cp+prPrc+tax),
            wb: user.walletInfo.usableCredits
        })
    }

    getPremiumSegPrice(){
        let prc = 0;
        this.props.premiumFilters.forEach(e => {
            prc+=e.price;
        }); 
        prc = prc*this.props.formControls.targetAudienceCount.value;
        return prc;
    }

    render(){
        return(
            <div className="flex col-20">
                <div className="col-15 margin-left--auto margin-right--auto">
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Campaign Charges</div>
                        <div className="text--bold text--darker">&#8377; {(this.state.cp).toFixed(2)}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Premium Segment Charges</div>
                        <div className="text--bold text--darker">&#8377; {(this.state.prPrc).toFixed(2)}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">GST (18&#37;)</div>
                        <div className="text--bold text--darker">&#8377; {(this.state.tax).toFixed(2)}</div>
                    </div>
                    <div className="col-20 flex pad bdr-btm flex-space--btw">
                        <div className="text--bold text--darker">Payable Amount</div>
                        <div className="text--bold text--darker">&#8377; {(this.state.pa).toFixed(2)}</div>
                    </div>
                    <div className="col-20 flex pad flex-space--btw text-intent">
                        <div>Wallet Balance</div>
                        <div>&#8377; {this.state.wb}</div>
                    </div>
                    {
                        this.props.campSubmitErr &&
                        <div className="col-20 form-error margin-btm text--center">
                            <span>{this.props.campSubmitErr}</span>
                        </div>
                    }
                    <div className="col-20 flex flex-horz-center flex-wrap pad">
                    {
                        (this.state.wb - this.state.pa >= 0) && !this.props.submitLoader &&
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
                        (this.state.wb - this.state.pa < 0) && !this.props.submitLoader &&
                        <React.Fragment>
                            <div className="col-20 form-error margin-btm text--center">
                                <span>Your Wallet balance is short of &#8377; {(Math.abs(this.state.wb - this.state.pa)).toFixed(2)} to Submit campaign.</span>
                            </div>
                            <div className="col-4">
                                <button className="ui grey button" style={{width:'100%'}} onClick={()=>this.props.back()}> Back </button>
                            </div>
                            <div className="margin-left">
                                <button className="ui green button" style={{width:'100%'}} onClick={()=>this.props.pay(Math.abs(this.state.wb - this.state.pa))} disabled={!!this.props.campSubmitErr}> Pay &#8377; {(Math.abs(this.state.wb - this.state.pa)).toFixed(2)} and Submit </button>
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