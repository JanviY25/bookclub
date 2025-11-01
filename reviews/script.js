document.addEventListener("DOMContentLoaded", () => {
  fetch("reviews.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load reviews.json: " + res.status);
      return res.json();
    })
    .then(json => {
      try {
        populateImages(json.images || {});
        populateArticles(json.articles || {});
      } catch (err) {
        console.error("Error applying JSON to DOM:", err);
      }
    })
    .catch(err => console.error(err));
});

/* ---------- Helpers ---------- */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeImageHTML(imgSrc, link) {
  if (!imgSrc) return "";
  const safeSrc = escapeHtml(imgSrc);
  if (link && String(link).trim() !== "") {
    return `<a href="${escapeHtml(link)}"><img class="img" src="${safeSrc}" alt=""></a>`;
  }
  return `<img class="img" src="${safeSrc}" alt="">`;
}

function setImageNode(node, imgSrc, link) {
  // If node is an <img>, set its src. Otherwise set innerHTML to an <img> or an anchor+img
  if (!node) return;
  if (!imgSrc) {
    // Nothing to set — clear gracefully
    if (node.tagName === "IMG") node.removeAttribute("src");
    else node.innerHTML = "";
    return;
  }
  if (node.tagName === "IMG") {
    node.src = imgSrc;
  } else {
    node.innerHTML = makeImageHTML(imgSrc, link);
  }
}

/* ---------- Populate image containers ---------- */
function populateImages(images) {
  // 1) .reviews .image (could be container or img)
  const elImage = document.querySelector(".reviews .image");
  if (elImage && images["image"]) {
    setImageNode(elImage, images["image"].image, images["image"].link);
  }

  // 2) .reviews .image-5 — complex structure, treat as container
  const elImage5 = document.querySelector(".reviews .image-5");
  if (elImage5 && images["image-5"]) {
    const v = images["image-5"];
    elImage5.innerHTML = `
      ${v.main ? `<img class="img" src="${escapeHtml(v.main)}" alt="">` : ""}
      <div class="image-6">
        ${v.overlay1 ? `<img class="image-3" src="${escapeHtml(v.overlay1)}" alt="">` : ""}
        ${v.overlay2 ? `<img class="image-4" src="${escapeHtml(v.overlay2)}" alt="">` : ""}
      </div>
      ${v.extra ? `<img class="image-3" src="${escapeHtml(v.extra)}" alt="">` : ""}
    `;
  }

  // 3) .image-wrapper (array)
  const wrappers = document.querySelectorAll(".reviews .image-wrapper");
  if (wrappers.length > 0 && Array.isArray(images["image-wrapper"])) {
    images["image-wrapper"].forEach((item, idx) => {
      const node = wrappers[idx];
      if (!node) return;
      setImageNode(node, item.image, item.link);
    });
  }

  // 4) .image-8 may be a container or img
  const elImage8 = document.querySelector(".reviews .image-8");
  if (elImage8 && images["image-8"] && images["image-8"].image) {
    // If it's an IMG, set src; if a container, create two images inside (original intent)
    if (elImage8.tagName === "IMG") {
      elImage8.src = images["image-8"].image;
    } else {
      elImage8.innerHTML = `
        <img class="img" src="${escapeHtml(images["image-8"].image)}" alt="">
        <img class="image-3" src="${escapeHtml(images["image-8"].image)}" alt="">
      `;
    }
  }

  // 5) .image-9 expected to be an <img>
  const elImage9 = document.querySelector(".reviews .image-9");
  if (elImage9 && images["image-9"] && images["image-9"].image) {
    if (elImage9.tagName === "IMG") elImage9.src = images["image-9"].image;
    else elImage9.innerHTML = `<img src="${escapeHtml(images["image-9"].image)}" alt="">`;
  }

  // 6) .image-10 container that should contain image-11 etc.
  const elImage10 = document.querySelector(".reviews .image-10");
  if (elImage10 && images["image-10"] && images["image-10"].image) {
    elImage10.innerHTML = `
      <img class="image-11" src="${escapeHtml(images["image-10"].image)}" alt="">
      <img class="image-3" src="${escapeHtml(images["image-10"].image)}" alt="">
    `;
  }

  // 7) .image-11 (single img) — set src only if it's an <img>
  const elImage11 = document.querySelector(".reviews .image-11");
  if (elImage11 && images["image-11"] && images["image-11"].image) {
    if (elImage11.tagName === "IMG") elImage11.src = images["image-11"].image;
    else elImage11.innerHTML = `<img src="${escapeHtml(images["image-11"].image)}" alt="">`;
  }

  // 8) .image-12
  const elImage12 = document.querySelector(".reviews .image-12");
  if (elImage12 && images["image-12"] && images["image-12"].image) {
    if (elImage12.tagName === "IMG") elImage12.src = images["image-12"].image;
    else elImage12.innerHTML = `<img src="${escapeHtml(images["image-12"].image)}" alt="">`;
  }
}

/* ---------- Populate article title blocks ---------- */
function populateArticles(articles) {
  Object.keys(articles).forEach(className => {
    const selector = `.reviews .${className}`;
    const el = document.querySelector(selector);
    if (!el) return;

    const data = articles[className] || {};
    const title = escapeHtml(data.title || "");
    const authorText = escapeHtml(data.authorText || "");
    const reviewerText = escapeHtml(data.reviewerText || "");

    if (className === "article-title-2" || className === "article-title-8") {
      el.innerHTML = `
        <div class="frame">
          <div class="div-wrapper">
            <div class="div-wrapper"><div class="text-wrapper-4">${title}</div></div>
          </div>
        </div>
        <div class="text-wrapper-5">${authorText}</div>
        <div class="text-wrapper-6">${reviewerText}</div>
      `;
    } else {
      el.innerHTML = `
        <div class="text-wrapper-4">${title}</div>
        <div class="text-wrapper-5">${authorText}</div>
        <div class="text-wrapper-8">${reviewerText}</div>
      `;
    }
  });
}
