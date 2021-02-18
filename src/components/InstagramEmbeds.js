import React from "react";
import InstagramEmbed from "react-instagram-embed";

function InstagramEmbeds() {
  const qwe =
    "32090f07adc24893fb3158f360841b2772b148063f8513bf39842cda70f09023";
  const asd = "393139286007145541700682931393";
  const [qweqwe, asdasd] = [...qwe].reduce(
    (r, char, i) => (r[i % 2].push(char), r),
    [[], []]
  );
  const [qweqweqwe, asdasdasd] = [...asd].reduce(
    (r, char, i) => (r[i % 2].push(char), r),
    [[], []]
  );
  const cat = "" + qweqweqwe.join("") + "|" + qweqwe.join("");
  const catt = "" + asdasd.join("") + "|" + asdasdasd.join("");

  return (
    <div className="right__side">
      <InstagramEmbed
        url="https://www.instagram.com/p/C/?hl=en"
        clientAccessToken={cat}
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
        url="https://www.instagram.com/p/BqGHnxPBkPj/"
        clientAccessToken={cat}
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
        url="https://www.instagram.com/p/B4TSlGxl0iy/"
        clientAccessToken={cat}
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
        url="https://www.instagram.com/p/B7xOgFjnuiO/"
        clientAccessToken={cat}
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
        url="https://www.instagram.com/p/CFsNZqKFTDx/"
        clientAccessToken={cat}
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
        clientAccessToken={cat}
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
