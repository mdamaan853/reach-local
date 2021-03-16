import React, {useState} from 'react';
import './GenericWhatsApp.css';
import PopUp from '../../Popup/Popup';
import { Icon, Popup } from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import utils from '../../../Services/utility-service';
import CircularLoader from '../../circular-loader/circular-loader';
import Path from '../../../Constants/img/WhatsApp.jpg';


export default function GenericWhatsApp(props){
    
    const [loader,setLoader] = useState(null);
    const[name, setName] = useState(null);
    const[withoutUpload, setWithoutUpload] = useState(null);

    const style = {
        borderRadius: 0,
        opacity: 0.85,
        padding: '1em',
    }
     // ########  Content IMAge ################
            const [fileCont, selectFileCont] = useState(null);
            const [imageCont, setImageCont] = useState(null);
            const [cropCont, setCropCont] = useState({aspect: 16 / 9});
            const [type, setType] = useState(null);
            const [resultCont, setResultCont] = useState(false);
            const [error, setError] = useState(null);

            function getCroppedImgContent(){
        
                const canvas = document.createElement('canvas');
                const scaleX = imageCont.naturalWidth / imageCont.width;
                const scaleY = imageCont.naturalHeight / imageCont.height;
                canvas.width = cropCont.width;
                canvas.height = cropCont.height;
                const ctx = canvas.getContext('2d');
               
                ctx.drawImage(
                  imageCont,
                  cropCont.x * scaleX,
                  cropCont.y * scaleY,
                  cropCont.width * scaleX,
                  cropCont.height * scaleY,
                  0,
                  0,
                  cropCont.width,
                  cropCont.height,
                );    
                const base64Image = canvas.toDataURL('image/jpeg');
                setResultCont(base64Image);           
            }

    /*############Content Video#################*/
    const [videoCont,setVideoCont] = useState(null);

    function setVideo(event){  
        setLoader(true);  
        let t=event.target.files[0].type.split("/");
        setType(t[0]);
        if (t[0] === "image"){
            setWithoutUpload(event.target.files[0]);
            selectFileCont(URL.createObjectURL(event.target.files[0]));
            setError(null);
            setName(event.target.files[0].name);            
        }
        else if(t[0] === ("video")){
           
            if(parseInt(event.target.files[0].size) <= parseInt(10000000)){
                setVideoCont(event.target.files[0]);
                setError(null);
                props.handleUpload(event.target.files[0],t[0],"Content");
                setLoader(false);
            }
            else{
                setVideoCont(null);
                setLoader(false);
                setError(`Uploaded File size is ${(event.target.files[0].size/1000000).toFixed(2)} MB. Max size of the uploaded file should not exceed 10MB`);
            }
        }
    }

        return(
            <main className={utils.isMobile ? "col-20 pad--half flex-direction--col":"col-20 pad--half flex flex-direction--row"}>
                <article style={utils.isMobile ? null:{flex:"50%"}}>
                    <div className="padding-all-12">
                        <div className="label">Template Content</div>
                        <textarea rows={`${utils.isMobile ? 10 : 20}`} maxLength="1000" cols={`${utils.isMobile ? "38" :"60" }`} value={props.formControls.templateCont.value}  onChange={(event) =>props.templateWhatsApp(event)}></textarea> 
                        <div><i className="text-small">(Max limit 1000 characters). Total {props.formControls && props.formControls.templateCont && props.formControls.templateCont.value && props.formControls.templateCont.value.length ? props.formControls.templateCont.value.length : "0" } characters and  { props.formControls && props.formControls.templateCont && props.formControls.templateCont.value && props.formControls.templateCont.value.length ? parseInt(1000)-parseInt(props.formControls.templateCont.value && props.formControls.templateCont.value.length)+" " : "1000"} characters left.</i></div>
                            {/* {
                                props.formControls.campaignName.error &&
                                <span className="form-error">{props.formControls.campaignName.error}</span>
                            } */}
                    </div>
                    <div className="padding-all-12">
                        <div className="form-control" style={{width:"90%"}}>
                            {utils.isMobile ? null :<i class="upload icon"></i>}
                            
                            <input type="file" className="content-file-input" multiple={false} accept="*/*" onChange={(event) =>setVideo(event) }/>
                           
                        </div>
                        {/* <div className="form-control" style={{width:"90%"}}>
                            {utils.isMobile ? null :<i class="upload icon"></i>}
                            <input type="file" className="content-file-input" multiple={false} onClick={()=>setLoader(true)} accept="image/*" onChange={(event) =>selectFileCont(URL.createObjectURL(event.target.files[0]))}/>
                        </div> */}
                        {
                            fileCont && 
                            <PopUp title="Content Image" togglePopup={()=>{return(selectFileCont(null),setLoader(false))}}>
                                <div className="img-container text--center">
                                    <h4>Original Image</h4>
                                    <ReactCrop src={fileCont} crop={cropCont} onImageLoaded={setImageCont} onChange={setCropCont}/>
                                    <div className="text--center">
                                        <button onClick={getCroppedImgContent} className="btn btn-fill btn-blue display-block">Crop Image</button>
                                        <button onClick={()=>{return(props.handleUpload(withoutUpload,type,"Content"),setLoader(false),selectFileCont(null))}} className="btn btn-fill btn-blue display-block margin-left--half">Upload Image</button>
                                    </div>
                                </div>
                                {
                                    resultCont &&
                                    <span className="img-container text--center">
                                        <h4>Cropped Image</h4>
                                        <ReactCrop src={resultCont} alt="Cropped Image" />
                                        <div className="text--center"><button className="btn btn-fill btn-success" onClick={()=>{return(props.handleImageUpload(resultCont,type,name,"Content"),setLoader(false),selectFileCont(null))}}>Upload</button></div>
                                    </span>
                                }
                            </PopUp>
                        }                       
                        {
                            videoCont &&
                            <div className="text-small">Uploaded Video Size:{(videoCont.size/1000000).toFixed(2)}MB</div>
                        }
                        <i className="text-small">(Max limit 10MB)</i>
                        { error &&  
                            <span className="form-error">{error}</span>
                        }
                    </div>
                    <div className="padding-all-12">
                                          <div className="flex" style={{alignItems:'end'}}>
                                                 
                                                        <div className="label">Url Shortner / Tracker&nbsp;
                                                               <Popup
                                                                      trigger={<Icon name='info circle' color="blue"/>}
                                                                      content='URL shortner will help you to track the number of clicks on the link.'
                                                                      position='top center'
                                                                      style={style}
                                                                      inverted
                                                               /></div>
                                                        <div className="ui action input" style={{width:'100%'}}>
                                                               <input  type="text"
                                                                      name="su"
                                                                      value={props.formControls.su.value}
                                                                      onChange={props.changeHandler}>
                                                               </input>
                                                               <button onClick={()=> props.createShortUrl()} className="ui green button">
                                                                      {!props.shortUrlLoader ? 'Create' : <i aria-hidden="true" class="spinner icon"></i>}
                                                               </button>
                                                        </div>
                                                        {
                                                               props.formControls.su.error &&
                                                               <div className="form-error form-error margin-top--quar">{props.formControls.su.error}</div>
                                                        }
                                                
                                          </div>
                                        {
                                            props.shortUrl &&
                                            <div className="padding-top--half" style={{fontSize:'smaller'}}>Short Url: <span className="margin-right" style={{color:'-webkit-link'}}>{props.shortUrl}</span> 
                                                <button class="ui teal icon right labeled tiny button" onClick={() => props.copyUrl()}>
                                                        <i aria-hidden="true" class="copy icon"></i>Copy
                                                </button>
                                            </div>
                                        }
                                   </div>
                </article>
                <article style={{flex:"50%"}}>              
                    <div className="padding-all-12 text-end margin-right--ten">    
                        <div className="label margin-right--fifty">Preview</div>
                        <div style={utils.isMobile ? {position:"relative", width:"62%", left:"22%",border: "1px soild black"} :{position:"relative", width:"62%", left:"38%",border: "1px soild black"}}>
                            <img width="100%"  src={Path} style={{objectFit: "contain"}} alt="Preview"/>
                            <Popup
                            trigger={<img alt="DP" width="12%" src={props.formControls.dpURL.value} className="DP_image"></img>}
                            content="WhatsApp Display Picture"
                            flowing 
                            hoverable
                            >
                            <Popup.Content>
                                    <img width="200" height="200" src={props.formControls.dpURL.value} alt="WhatsApp DP"/>
                            </Popup.Content>
                            </Popup>
                            {
                                ( props.mediaType || (props.formControls && props.formControls.contentMediaUrl && props.formControls.contentMediaUrl.value) || (props.formControls && props.formControls.templateCont && props.formControls.templateCont.value) ) &&   
                                <div className="preview__content in">
                                    {
                                        props.mediaType && props.mediaType === "video" &&
                                        <video width="238" height="133" style={{objectFit: "contain"}} controls>
                                            <source src={props.formControls.contentMediaUrl.value}></source>
                                        </video>
                                    }
                                    {
                                        props.mediaType && props.mediaType === "image" && props.formControls && props.formControls.contentMediaUrl && props.formControls.contentMediaUrl.value &&
                                        <img alt="Content" width="100%"  src={props.formControls.contentMediaUrl.value} style={{objectFit: "contain",margin:'0 auto',maxWidth:'100%'}}></img>
                                    }  
                                    <p className="text__overlay" style={{whiteSpace:"pre-wrap"}}>{props.formControls && props.formControls.templateCont && props.formControls.templateCont.value}</p>
                                   
                                </div>
                            }
                        </div>               
                    </div>
                    
                </article>
                {
                    loader &&
                    <div className="global-loader col-1">
                        <CircularLoader stroke={"#0c73a5"} size={"36"} buttonSize={"50px"}></CircularLoader>
                    </div>
                }
            </main>
        )
    
}