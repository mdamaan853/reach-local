import React, { Component } from 'react';
import utils from '../../Services/utility-service';
import iconsNames from '../../Constants/icon-names.constants';
import './IconSearch.css';

const initialState = {
    searchText:'',
    matchingIcons:[],
    showResults:false
}

class IconSearch extends Component {
    constructor(props){
        super(props);
        this.state = initialState;
        this.textInput = React.createRef();
    }

    componentDidMount(){
        if(this.props.preValue){
            this.textInput.current.value = this.props.preValue;
            this.setState({
                searchText: this.props.preValue
            });
        }
    }
    
    searchIcons(){
        console.log("inside: searchIcons")
        if(!!this.textInput.current.value){
            let sr = iconsNames.filter( e => {
                return e.includes(this.textInput.current.value);
            });
            this.setState({
                matchingIcons: sr,
                showResults: true
            })
        }else{
            this.setState({
                matchingIcons: [],
                showResults: false
            })
        }
    } 
    
    handleKeyUp = utils.debounce(this.searchIcons.bind(this),300);

    selectIcon(item){
        let obj = {
            target:{
                name: this.props.name,
                value: item
            }
        }
        this.textInput.current.value = item;
        console.log(item);
        this.props.callback(obj);
        this.setState({
            showResults:false
        })
    }

    handleFocus = ()=>{
        if(this.state.matchingIcons && this.state.matchingIcons.length > 0){
            this.setState({
                showResults: true
            })
        }
    }

    handleBlur = ()=>{
        setTimeout(()=>{
            this.setState({
                showResults: false
            })
        },100);
    }

    render(){
        return(
            <div className="col-20">
                <input className="form-control" type="text" onKeyUp={this.handleKeyUp} onFocus={this.handleFocus} onBlur={this.handleBlur} id="icon-search" ref={this.textInput} style={{width:'94%'}} placeholder="Type to Search"/>
                {
                    this.state.showResults && 
                    <div className="results">
                        {
                            this.state.matchingIcons.map((item,index)=>{
                                return(
                                    <span key={index} className="list-icons"><i aria-hidden="true" className={`${item} big icon`} onClick={()=>this.selectIcon(item)}></i></span>
                                );
                            })
                        }
                    </div>
                }
            </div> 
        );
    }
}

export default IconSearch;