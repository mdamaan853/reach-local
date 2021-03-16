import React, {Component}  from 'react';
import {getTransactions} from '../../Services/shortUrl-service';

class Transactions extends Component{
    constructor(props){
        super(props);
        this.state={
           transaction:[]
        }
    }
    componentDidMount(){
       this.fetchTransactions();
    }

    fetchTransactions(){
        const body={} 
        getTransactions(body)
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
               this.setState({
                transaction:data.txns,   
               })
            }
            console.log(this.state.transaction);
        })
        .catch(error=>{
            console.log("Error");
        })
    }

    render(){
        return(
        <section className="card">           
            <table className="client">
                <tbody>
                    <tr>
                        <th>Date</th>
                        <th>Transaction Description</th>
                        <th>Medium</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Balance Credits</th>
                    </tr>
                    {/* <tr>
                        <th>{tem.created}</th>
                        <th>{item.remarks}</th>
                        <th>Medium</th>
                        <th>{item.event}</th>
                        <th>{item.creditDebit}</th>
                        <th>{item.status}</th>
                        <th>{item.balanceCredit}</th>
                    </tr> */}
                </tbody>
            </table>         
        </section> 
        );
    }
}   
                 
              
                    
       

export default Transactions;