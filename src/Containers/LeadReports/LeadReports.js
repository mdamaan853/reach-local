import React, { Component } from 'react'; 
import utils from '../../Services/utility-service';

export default class LeadReports extends Component{

    componentDidMount() {
      let mainHeight = document.querySelector(".main");
      mainHeight = mainHeight.clientHeight - 120;
      let frame = document.querySelector("#datastudio-iframe");
      frame.style.width = "100%";
      frame.style.height = mainHeight+"px";  
    }
    back(){
        this.props.history.push("/leads/management");
    }
    render(){
        return(
          <React.Fragment>
            
            {
                utils.isAdmin && 
                <div>
                  <article className="card-custom  pad">
                    <h4 className="ui header">Lead Report Upload</h4>
                  </article>
                    <div className="margin-btm">
                        <button onClick={()=>this.back()} className="ui icon left labeled tiny button"><i aria-hidden="true" className="left chevron icon"></i>Back</button>
                    </div>
                    <iframe src="https://datastudio.google.com/embed/reporting/1f1uLpDo7HHDuOfZyYP4JnFzfJk6IjdlC/page/zumTB" frameborder="0" id="datastudio-iframe" style={{border:0}} allowfullscreen title="Lead Reports"></iframe>
                </div>
            }
          </React.Fragment>
        );
    }
}