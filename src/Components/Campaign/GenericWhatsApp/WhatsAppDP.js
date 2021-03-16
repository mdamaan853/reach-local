import React,{useState} from 'react';
import './GenericWhatsApp.css';
import Popup from '../../Popup/Popup';
import utils from '../../../Services/utility-service';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


export default function WhatsAppDP(props){
    
    const [withoutUpld, setWithoutUpld] = useState(null);
    const [error, setError] = useState(null);
    const [file,selectFile] = useState(null);
    const [image,setImage] = useState(null);
    const [crop, setCrop] = useState({aspect: 1 / 1, unit:'px'});
    const [display,setDisplay] = useState(null);
    const [result, setResult] = useState(null);
    const [type,setType] = useState(null);
    const [name, setName] = useState(null);
  
    function selectImage(event){
        if(event.target.files[0]){
            selectFile(URL.createObjectURL(event.target.files[0]));
            setWithoutUpld(event.target.files[0]);
            setError(null);
            props.toggleLoader();
            setResult(null); // To clear last saved cropped image
            setName(event.target.files[0].name);
            let t=event.target.files[0].type.split("/");
            setType(t[0]);          
        }
        else{
            return;
        }    
    }

    function uploadImage(){
       if(parseInt(image.naturalWidth) <= 192 && parseInt(image.naturalHeight) <= 192){ 
           setError(null);
           props.toggleLoader();
           props.handleUpload(withoutUpld,type,"DP");
           URL.revokeObjectURL(file);
           selectFile(null);    
          
       }
       else{
        setError("Max size of image should be 192 X 192 pixels. Kindly crop image before uploading");
        return;
       }
    }

    function getCroppedImg(){
        setError(null);

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
       
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );
        
        setDisplay(canvas);
        const base64Image = canvas.toDataURL('image/jpeg');
        setResult(base64Image);                   
    }
    function finalUpload(){
        
        if(parseInt(display.width) <= 192 && parseInt(display.height) <= 192){
            props.toggleLoader();
            setError(null);
            URL.revokeObjectURL(file);         
            props.handleImageUpload(result,type,name,"DP");
            selectFile(null);
        }
        else{
            setError("Max size of image should be 192 X 192 pixels. Kindly crop image before uploading");
            return;
        }
    }
return(
    <div className="padding-all-12 col-9">
        <div className="label">Upload WhatsApp DP</div>
        <div className="form-control" style={{width:"90%"}}>
     {utils.isMobile ? null :<i class="upload icon"></i>}
     <input type="file" multiple={false} accept="image/*" 
    //  onClick={()=>setLoader(true)}
      className="custom-file-input upload icon" onChange={(event) =>selectImage(event)}></input>
     {
         file && 
         <Popup title="WhatsApp DP (Display Picture)" togglePopup={()=>{return(selectFile(null),props.toggleLoader())}}>
             <div className="img-container text--center">
                 <h4>Original Image</h4>
                 <ReactCrop src={file} crop={crop} onImageLoaded={setImage} onChange={setCrop}/>
                 {
                    image &&
                    <div className="text-small">Original Image:{image.naturalWidth +" "}x {image.naturalHeight} pixels</div>
                 }
                 <div className="text--center">
                     <button onClick={getCroppedImg} className="btn btn-fill btn-blue">Crop Image</button>
                     {
                        !error && 
                        <button onClick={uploadImage} className="btn btn-fill btn-blue margin-left--half">Upload Image</button>
                     }
                     {
                         error && !display &&
                         <div className="form-error">{error}</div>
                     }
                 </div>
             </div>
             {
                 result &&
                 <span className="img-container text--center">
                     <h4>Cropped Image</h4>
                     <ReactCrop src={result} alt="Cropped Image" />
                     {display && 
                        <div className="text-small">Final Image:{display.width +" "}x {display.height} pixels</div>
                     }
                     {
                        error && display &&
                        <div className="form-error">{error}</div>
                     }
                     <i className="text-small">(Max limit 192x192 pixels)</i>
                     <div className="text--center"><button className="btn btn-fill btn-success"
                      onClick={finalUpload}>Upload</button></div>
                      
                 </span>
             }
         </Popup>
     }
 </div>                      
 <i className="text-small">(Max limit 192x192 pixels)</i>
 {/* {
     props.formControls.campaignName.error &&
     <span className="form-error">{props.formControls.campaignName.error}</span>
 } */}
</div>
)
}