import React from 'react';
import CircularLoader from '../../Components/circular-loader/circular-loader';
import classNames from 'classnames';
import utils from '../../Services/utility-service';

function Pagination (props){
    let btnClassP = classNames({
        'ui small right floated icon left labeled button': true,
        'disabled' : props.start === 0
    });
    let btnClassN = classNames({
        'ui small right floated icon right labeled button': true,
        'disabled' : !props.hasNext
    });
    if(!props.data){
        props.data = [];
    }
    return(
        <React.Fragment>
                <table>
                    <tbody className={`${utils.isMobile ? 'left-thirty': 'leftTwoTen'} full-width leads-table-footer`}>
                        {
                            !utils.isMobile &&
                            <tr className="" style={{width:'100%',display:'block'}}>
                                {
                                    props.data.length > 0 &&
                                    <th colSpan="2" className="col-4">
                                        <div style={{fontSize:'13px',textAlign:'left'}}>Showing results from <span>{props.start + 1}</span> to <span>{props.start + props.data.length}</span> </div>
                                    </th>
                                }
                                <th colSpan="11" className="col-2" style={{borderLeft:'none'}}>
                                    {
                                        !props.loader && 
                                        <button className={btnClassN} onClick={()=>props.getData('next')}>Next<i aria-hidden="true" className="chevron right icon"></i></button>
                                    }
                                    {
                                        !props.loader && 
                                        <button className={btnClassP} onClick={()=>props.getData('previous')}><i aria-hidden="true" className="chevron left icon"></i>Previous</button>
                                    }
                                    {
                                        props.loader &&
                                        <div className="col-1 floated margin-left--auto margin-right right ui">
                                            <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                        </div>
                                    }
                                </th>
                            </tr>
                        }
                        {
                            !!utils.isMobile &&
                            <React.Fragment>
                              <tr  style={{width:'100%',display:'block'}} className="text--center">
                                  {
                                      props.data.length && props.data.length > 0 &&
                                      <div style={{fontSize:'13px'}}>Showing results from <span>{props.start + 1}</span> to <span>{props.start + props.data.length}</span> </div>
                                  }
                              </tr> 
                              <tr style={{width:'100%',display:'block',borderLeft:'none'}}  className="margin-left--auto margin-right--auto">
                                  {
                                      !props.loader && 
                                      <button className={btnClassN} onClick={()=>props.getData('next')}>Next<i aria-hidden="true" className="chevron right icon"></i></button>
                                  }
                                  {
                                      !props.loader && 
                                      <button className={btnClassP} onClick={()=>props.getData('previous')}><i aria-hidden="true" className="chevron left icon"></i>Previous</button>
                                  }
                                  {
                                      props.loader &&
                                      <div className="col-1 floated margin-left--auto margin-right right ui">
                                          <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                                      </div>
                                  }
                              </tr>
                          </React.Fragment>
                        }
                    </tbody>
                </table>
        </React.Fragment>
    );
}

export default Pagination;