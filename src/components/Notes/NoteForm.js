import React from "react";

const NoteForm = (props) => {
    const {formTitle, title, content, titleChanged, contentChanged, submitClicked, submitText} = props;

    return (
        <div>
          <h2>{formTitle}</h2>
        <form>
          <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="Title"
            value={title}
            onChange={titleChanged}
          />

          <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder="Content"
            value={content}
            onChange={contentChanged}
          />
           <a href="#" className="button green" onClick={submitClicked}>
            {submitText}
          </a>
        </form>
        </div>
    );
};

export default NoteForm;