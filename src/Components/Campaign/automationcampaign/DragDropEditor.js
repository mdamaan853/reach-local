import React, { useRef } from 'react';
import { render } from 'react-dom'


import EmailEditor from 'react-email-editor';

const DragAndDrog = (props) => {
  const emailEditorRef = useRef(null);
const {FormData,setFormData}=props

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      FormData.content=html
      console.log('exportHtml', html);
      console.log(FormData)
    });
  };

  const onLoad = (e) => {
    console.log(e)
      console.log(FormData)
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  return (
    <div>
      
      <EmailEditor
        ref={emailEditorRef}
        onLoad={onLoad}
        
      />
      <div>
        <button className="btn btn-success" onClick={exportHtml}>save</button>
      </div>
    </div>
  );
};

export default DragAndDrog