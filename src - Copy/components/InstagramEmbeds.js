import React from "react";
import InstagramEmbed from "react-instagram-embed";

function InstagramEmbeds() {
  return (
    <div className="right__side">
      <InstagramEmbed
        url="https://www.instagram.com/p/CEdLs05FWTn/"
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      <InstagramEmbed
        url="https://www.instagram.com/p/Bi-hISIghYe/"
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      <InstagramEmbed
        url="https://www.instagram.com/p/B1V5m7WFfUy/"
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
    </div>
  );
}

export default InstagramEmbeds;
